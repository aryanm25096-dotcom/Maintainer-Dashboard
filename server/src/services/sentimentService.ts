// Simple sentiment analysis service
// In production, you might want to use a more sophisticated NLP library

interface SentimentResult {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  score: number;
  confidence: number;
}

export class SentimentService {
  private positiveWords = [
    'great', 'excellent', 'awesome', 'amazing', 'fantastic', 'wonderful',
    'good', 'nice', 'perfect', 'brilliant', 'outstanding', 'superb',
    'thanks', 'thank you', 'appreciate', 'love', 'like', 'helpful',
    'useful', 'clean', 'elegant', 'simple', 'clear', 'well',
    'improve', 'better', 'enhance', 'fix', 'resolve', 'solve',
    'approve', 'approved', 'merge', 'looks good', 'lgtm'
  ];

  private negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'wrong', 'incorrect',
    'broken', 'bug', 'issue', 'problem', 'error', 'fail',
    'disappointed', 'frustrated', 'confused', 'unclear', 'messy',
    'hack', 'hacky', 'ugly', 'complex', 'complicated', 'hard',
    'difficult', 'struggle', 'struggling', 'stuck', 'blocked',
    'reject', 'rejected', 'denied', 'declined', 'no', 'not'
  ];

  private neutralWords = [
    'ok', 'okay', 'fine', 'sure', 'yes', 'no', 'maybe',
    'perhaps', 'possibly', 'might', 'could', 'would',
    'should', 'need', 'require', 'must', 'have to'
  ];

  analyze(text: string): SentimentResult {
    if (!text || text.trim().length === 0) {
      return {
        sentiment: 'NEUTRAL',
        score: 0,
        confidence: 0
      };
    }

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);

    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    words.forEach(word => {
      if (this.positiveWords.includes(word)) {
        positiveCount++;
      } else if (this.negativeWords.includes(word)) {
        negativeCount++;
      } else if (this.neutralWords.includes(word)) {
        neutralCount++;
      }
    });

    const total = words.length;
    const positiveScore = positiveCount / total;
    const negativeScore = negativeCount / total;
    const neutralScore = neutralCount / total;

    // Calculate sentiment based on scores
    let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    let score: number;
    let confidence: number;

    if (positiveScore > negativeScore && positiveScore > neutralScore) {
      sentiment = 'POSITIVE';
      score = positiveScore;
      confidence = positiveScore;
    } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
      sentiment = 'NEGATIVE';
      score = -negativeScore;
      confidence = negativeScore;
    } else {
      sentiment = 'NEUTRAL';
      score = 0;
      confidence = neutralScore;
    }

    // Boost confidence for longer texts
    if (total > 10) {
      confidence = Math.min(confidence * 1.2, 1);
    }

    return {
      sentiment,
      score,
      confidence
    };
  }

  analyzeBatch(texts: string[]): SentimentResult[] {
    return texts.map(text => this.analyze(text));
  }

  getAverageSentiment(results: SentimentResult[]): SentimentResult {
    if (results.length === 0) {
      return {
        sentiment: 'NEUTRAL',
        score: 0,
        confidence: 0
      };
    }

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalScore / results.length;
    const averageConfidence = results.reduce((sum, result) => sum + result.confidence, 0) / results.length;

    let sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    if (averageScore > 0.1) {
      sentiment = 'POSITIVE';
    } else if (averageScore < -0.1) {
      sentiment = 'NEGATIVE';
    } else {
      sentiment = 'NEUTRAL';
    }

    return {
      sentiment,
      score: averageScore,
      confidence: averageConfidence
    };
  }

  // Analyze PR review sentiment
  analyzePRReview(reviewBody: string, prTitle: string, prBody?: string): SentimentResult {
    const combinedText = `${prTitle} ${prBody || ''} ${reviewBody}`;
    return this.analyze(combinedText);
  }

  // Analyze issue comment sentiment
  analyzeIssueComment(commentBody: string, issueTitle: string, issueBody?: string): SentimentResult {
    const combinedText = `${issueTitle} ${issueBody || ''} ${commentBody}`;
    return this.analyze(combinedText);
  }

  // Get sentiment trends over time
  getSentimentTrends(reviews: Array<{ text: string; date: Date }>): {
    period: string;
    positive: number;
    neutral: number;
    negative: number;
  }[] {
    const periods: { [key: string]: SentimentResult[] } = {};

    reviews.forEach(review => {
      const date = new Date(review.date);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!periods[period]) {
        periods[period] = [];
      }
      
      periods[period].push(this.analyze(review.text));
    });

    return Object.entries(periods).map(([period, results]) => {
      const positive = results.filter(r => r.sentiment === 'POSITIVE').length;
      const neutral = results.filter(r => r.sentiment === 'NEUTRAL').length;
      const negative = results.filter(r => r.sentiment === 'NEGATIVE').length;

      return {
        period,
        positive,
        neutral,
        negative
      };
    }).sort((a, b) => a.period.localeCompare(b.period));
  }
}
