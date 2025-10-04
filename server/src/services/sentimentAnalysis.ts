import Sentiment from 'sentiment';
import natural from 'natural';
import OpenAI from 'openai';

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Initialize OpenAI client (optional)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Types for sentiment analysis
export interface SentimentResult {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  score: number;
  confidence: number;
  emotions: string[];
  personality: PersonalityTraits;
}

export interface PersonalityTraits {
  helpfulness: number;
  constructiveness: number;
  professionalism: number;
  empathy: number;
  clarity: number;
  encouragement: number;
}

export interface SentimentTrend {
  period: string;
  positive: number;
  neutral: number;
  negative: number;
  averageScore: number;
}

export interface RepositoryHeatmap {
  repository: string;
  sentiment: number;
  reviewCount: number;
  averageScore: number;
}

export interface MaintainerPersonality {
  overallScore: number;
  traits: PersonalityTraits;
  strengths: string[];
  improvements: string[];
  communicationStyle: string;
  burnoutRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class SentimentAnalysisService {
  private cache = new Map<string, SentimentResult>();
  private rateLimitDelay = 1000; // 1 second between API calls

  // Analyze single PR comment
  async analyzePRComment(commentText: string): Promise<SentimentResult> {
    const cacheKey = `comment_${this.hashString(commentText)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Basic sentiment analysis
      const basicSentiment = sentiment.analyze(commentText);
      
      // Enhanced analysis with natural language processing
      const emotions = this.extractEmotions(commentText);
      const personality = this.analyzePersonalityTraits(commentText);
      
      // Optional: OpenAI analysis for more sophisticated insights
      let enhancedAnalysis = null;
      if (openai && commentText.length > 50) {
        enhancedAnalysis = await this.getOpenAIAnalysis(commentText);
      }

      const result: SentimentResult = {
        sentiment: this.categorizeSentiment(basicSentiment.score),
        score: basicSentiment.score,
        confidence: this.calculateConfidence(basicSentiment, commentText),
        emotions: emotions,
        personality: enhancedAnalysis?.personality || personality,
      };

      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error analyzing PR comment:', error);
      return this.getDefaultSentiment();
    }
  }

  // Batch analyze multiple comments efficiently
  async batchAnalyzeComments(comments: string[]): Promise<SentimentResult[]> {
    const results: SentimentResult[] = [];
    const batchSize = 10;
    
    for (let i = 0; i < comments.length; i += batchSize) {
      const batch = comments.slice(i, i + batchSize);
      const batchPromises = batch.map(comment => this.analyzePRComment(comment));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Rate limiting
      if (i + batchSize < comments.length) {
        await this.delay(this.rateLimitDelay);
      }
    }
    
    return results;
  }

  // Calculate maintainer personality from review history
  calculateMaintainerPersonality(reviewHistory: SentimentResult[]): MaintainerPersonality {
    if (reviewHistory.length === 0) {
      return this.getDefaultPersonality();
    }

    // Calculate average traits
    const avgTraits: PersonalityTraits = {
      helpfulness: this.average(reviewHistory.map(r => r.personality.helpfulness)),
      constructiveness: this.average(reviewHistory.map(r => r.personality.constructiveness)),
      professionalism: this.average(reviewHistory.map(r => r.personality.professionalism)),
      empathy: this.average(reviewHistory.map(r => r.personality.empathy)),
      clarity: this.average(reviewHistory.map(r => r.personality.clarity)),
      encouragement: this.average(reviewHistory.map(r => r.personality.encouragement)),
    };

    const overallScore = this.average(reviewHistory.map(r => r.score));
    
    // Identify strengths and improvements
    const strengths = this.identifyStrengths(avgTraits);
    const improvements = this.identifyImprovements(avgTraits);
    
    // Determine communication style
    const communicationStyle = this.determineCommunicationStyle(avgTraits);
    
    // Assess burnout risk
    const burnoutRisk = this.assessBurnoutRisk(reviewHistory);

    return {
      overallScore,
      traits: avgTraits,
      strengths,
      improvements,
      communicationStyle,
      burnoutRisk,
    };
  }

  // Generate sentiment trends over time
  generateSentimentTrends(data: Array<{ sentiment: SentimentResult; date: Date }>, timeframe: 'week' | 'month' | 'year'): SentimentTrend[] {
    const trends: SentimentTrend[] = [];
    const groupedData = this.groupDataByTimeframe(data, timeframe);

    for (const [period, periodData] of Object.entries(groupedData)) {
      const positive = periodData.filter(d => d.sentiment.sentiment === 'POSITIVE').length;
      const neutral = periodData.filter(d => d.sentiment.sentiment === 'NEUTRAL').length;
      const negative = periodData.filter(d => d.sentiment.sentiment === 'NEGATIVE').length;
      const averageScore = this.average(periodData.map(d => d.sentiment.score));

      trends.push({
        period,
        positive,
        neutral,
        negative,
        averageScore,
      });
    }

    return trends.sort((a, b) => a.period.localeCompare(b.period));
  }

  // Create sentiment heatmap by repository
  createSentimentHeatmap(repositories: Array<{ name: string; reviews: SentimentResult[] }>): RepositoryHeatmap[] {
    return repositories.map(repo => {
      const scores = repo.reviews.map(r => r.score);
      const averageScore = this.average(scores);
      const sentiment = this.categorizeSentiment(averageScore);
      
      return {
        repository: repo.name,
        sentiment: sentiment === 'POSITIVE' ? 1 : sentiment === 'NEGATIVE' ? -1 : 0,
        reviewCount: repo.reviews.length,
        averageScore,
      };
    });
  }

  // Private helper methods
  private categorizeSentiment(score: number): 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' {
    if (score > 2) return 'POSITIVE';
    if (score < -2) return 'NEGATIVE';
    return 'NEUTRAL';
  }

  private calculateConfidence(sentiment: any, text: string): number {
    const wordCount = text.split(' ').length;
    const comparative = Math.abs(sentiment.comparative);
    const confidence = Math.min(comparative * wordCount / 10, 1);
    return Math.max(confidence, 0.1);
  }

  private extractEmotions(text: string): string[] {
    const emotions: string[] = [];
    const lowerText = text.toLowerCase();

    const emotionKeywords = {
      positive: ['great', 'excellent', 'awesome', 'amazing', 'fantastic', 'wonderful', 'love', 'like'],
      negative: ['bad', 'terrible', 'awful', 'horrible', 'wrong', 'broken', 'issue', 'problem'],
      encouraging: ['good', 'nice', 'perfect', 'brilliant', 'outstanding', 'superb', 'thanks'],
      constructive: ['improve', 'better', 'enhance', 'fix', 'resolve', 'suggest', 'recommend'],
      professional: ['please', 'consider', 'review', 'check', 'verify', 'confirm', 'approve'],
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        emotions.push(emotion);
      }
    }

    return emotions;
  }

  private analyzePersonalityTraits(text: string): PersonalityTraits {
    const lowerText = text.toLowerCase();
    
    return {
      helpfulness: this.calculateTraitScore(lowerText, ['help', 'assist', 'support', 'guide', 'explain']),
      constructiveness: this.calculateTraitScore(lowerText, ['improve', 'better', 'enhance', 'suggest', 'recommend']),
      professionalism: this.calculateTraitScore(lowerText, ['please', 'thank', 'appreciate', 'respect', 'consider']),
      empathy: this.calculateTraitScore(lowerText, ['understand', 'feel', 'experience', 'difficult', 'challenging']),
      clarity: this.calculateTraitScore(lowerText, ['clear', 'simple', 'explain', 'detail', 'specific']),
      encouragement: this.calculateTraitScore(lowerText, ['great', 'good', 'nice', 'excellent', 'awesome']),
    };
  }

  private calculateTraitScore(text: string, keywords: string[]): number {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    return Math.min(matches / keywords.length, 1);
  }

  private async getOpenAIAnalysis(text: string): Promise<{ personality: PersonalityTraits }> {
    if (!openai) return { personality: this.analyzePersonalityTraits(text) };

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Analyze the personality traits of a code reviewer based on their comment. Return a JSON object with helpfulness, constructiveness, professionalism, empathy, clarity, and encouragement scores (0-1).'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return { personality: analysis };
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      return { personality: this.analyzePersonalityTraits(text) };
    }
  }

  private identifyStrengths(traits: PersonalityTraits): string[] {
    const strengths: string[] = [];
    
    if (traits.helpfulness > 0.7) strengths.push('Highly helpful and supportive');
    if (traits.constructiveness > 0.7) strengths.push('Constructive feedback provider');
    if (traits.professionalism > 0.7) strengths.push('Professional communication style');
    if (traits.empathy > 0.7) strengths.push('Empathetic and understanding');
    if (traits.clarity > 0.7) strengths.push('Clear and concise communicator');
    if (traits.encouragement > 0.7) strengths.push('Encouraging and positive');
    
    return strengths.length > 0 ? strengths : ['Consistent reviewer'];
  }

  private identifyImprovements(traits: PersonalityTraits): string[] {
    const improvements: string[] = [];
    
    if (traits.helpfulness < 0.5) improvements.push('Provide more helpful guidance');
    if (traits.constructiveness < 0.5) improvements.push('Focus on constructive feedback');
    if (traits.professionalism < 0.5) improvements.push('Maintain professional tone');
    if (traits.empathy < 0.5) improvements.push('Show more empathy in reviews');
    if (traits.clarity < 0.5) improvements.push('Improve clarity of communication');
    if (traits.encouragement < 0.5) improvements.push('Add more encouragement');
    
    return improvements.length > 0 ? improvements : ['Continue current approach'];
  }

  private determineCommunicationStyle(traits: PersonalityTraits): string {
    const dominantTrait = Object.entries(traits).reduce((a, b) => traits[a[0] as keyof PersonalityTraits] > traits[b[0] as keyof PersonalityTraits] ? a : b)[0];
    
    const styles: Record<string, string> = {
      helpfulness: 'Supportive and guiding',
      constructiveness: 'Solution-focused and improvement-oriented',
      professionalism: 'Formal and structured',
      empathy: 'Understanding and considerate',
      clarity: 'Clear and direct',
      encouragement: 'Positive and motivating',
    };
    
    return styles[dominantTrait] || 'Balanced and comprehensive';
  }

  private assessBurnoutRisk(reviewHistory: SentimentResult[]): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (reviewHistory.length < 10) return 'LOW';
    
    const recentReviews = reviewHistory.slice(-20);
    const negativeRatio = recentReviews.filter(r => r.sentiment === 'NEGATIVE').length / recentReviews.length;
    const lowEncouragement = recentReviews.filter(r => r.personality.encouragement < 0.3).length / recentReviews.length;
    
    if (negativeRatio > 0.6 || lowEncouragement > 0.7) return 'HIGH';
    if (negativeRatio > 0.4 || lowEncouragement > 0.5) return 'MEDIUM';
    return 'LOW';
  }

  private groupDataByTimeframe(data: Array<{ sentiment: SentimentResult; date: Date }>, timeframe: string) {
    const grouped: Record<string, Array<{ sentiment: SentimentResult; date: Date }>> = {};
    
    data.forEach(item => {
      let period: string;
      const date = new Date(item.date);
      
      switch (timeframe) {
        case 'week':
          period = `${date.getFullYear()}-W${this.getWeekNumber(date)}`;
          break;
        case 'month':
          period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          period = String(date.getFullYear());
          break;
        default:
          period = date.toISOString().split('T')[0];
      }
      
      if (!grouped[period]) grouped[period] = [];
      grouped[period].push(item);
    });
    
    return grouped;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  private average(numbers: number[]): number {
    return numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getDefaultSentiment(): SentimentResult {
    return {
      sentiment: 'NEUTRAL',
      score: 0,
      confidence: 0.5,
      emotions: [],
      personality: this.getDefaultPersonality().traits,
    };
  }

  private getDefaultPersonality(): MaintainerPersonality {
    return {
      overallScore: 0,
      traits: {
        helpfulness: 0.5,
        constructiveness: 0.5,
        professionalism: 0.5,
        empathy: 0.5,
        clarity: 0.5,
        encouragement: 0.5,
      },
      strengths: ['Consistent reviewer'],
      improvements: ['Continue current approach'],
      communicationStyle: 'Balanced and comprehensive',
      burnoutRisk: 'LOW',
    };
  }
}
