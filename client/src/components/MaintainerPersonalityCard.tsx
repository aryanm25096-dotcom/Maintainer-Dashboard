import React from 'react';
import { 
  Heart, 
  Lightbulb, 
  Shield, 
  Users, 
  MessageSquare, 
  ThumbsUp,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Star
} from 'lucide-react';

interface PersonalityTraits {
  helpfulness: number;
  constructiveness: number;
  professionalism: number;
  empathy: number;
  clarity: number;
  encouragement: number;
}

interface MaintainerPersonality {
  overallScore: number;
  traits: PersonalityTraits;
  strengths: string[];
  improvements: string[];
  communicationStyle: string;
  burnoutRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface MaintainerPersonalityCardProps {
  personality: MaintainerPersonality;
  className?: string;
}

const MaintainerPersonalityCard: React.FC<MaintainerPersonalityCardProps> = ({ 
  personality, 
  className = "" 
}) => {
  const getBurnoutRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'LOW':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getBurnoutRiskIcon = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4" />;
      case 'MEDIUM':
        return <TrendingUp className="w-4 h-4" />;
      case 'LOW':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const traitIcons = {
    helpfulness: <Heart className="w-5 h-5" />,
    constructiveness: <Lightbulb className="w-5 h-5" />,
    professionalism: <Shield className="w-5 h-5" />,
    empathy: <Users className="w-5 h-5" />,
    clarity: <MessageSquare className="w-5 h-5" />,
    encouragement: <ThumbsUp className="w-5 h-5" />,
  };

  const traitLabels = {
    helpfulness: 'Helpfulness',
    constructiveness: 'Constructiveness',
    professionalism: 'Professionalism',
    empathy: 'Empathy',
    clarity: 'Clarity',
    encouragement: 'Encouragement',
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Maintainer Personality
        </h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getBurnoutRiskColor(personality.burnoutRisk)}`}>
          {getBurnoutRiskIcon(personality.burnoutRisk)}
          <span>Burnout Risk: {personality.burnoutRisk}</span>
        </div>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-primary-600 mb-2">
          {(personality.overallScore * 100).toFixed(0)}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Overall Maintainer Score
        </div>
      </div>

      {/* Communication Style */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Communication Style
        </h4>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {personality.communicationStyle}
          </p>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Personality Traits
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(personality.traits).map(([trait, score]) => (
            <div key={trait} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                {traitIcons[trait as keyof typeof traitIcons]}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {traitLabels[trait as keyof typeof traitLabels]}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${score * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-8">
                  {(score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Strengths
        </h4>
        <div className="space-y-2">
          {personality.strengths.map((strength, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {strength}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Areas for Improvement */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Areas for Improvement
        </h4>
        <div className="space-y-2">
          {personality.improvements.map((improvement, index) => (
            <div key={index} className="flex items-start space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {improvement}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintainerPersonalityCard;
