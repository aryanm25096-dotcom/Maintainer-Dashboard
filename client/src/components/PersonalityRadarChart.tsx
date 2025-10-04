import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface PersonalityTraits {
  helpfulness: number;
  constructiveness: number;
  professionalism: number;
  empathy: number;
  clarity: number;
  encouragement: number;
}

interface PersonalityRadarChartProps {
  traits: PersonalityTraits;
  title?: string;
  className?: string;
}

const PersonalityRadarChart: React.FC<PersonalityRadarChartProps> = ({ 
  traits, 
  title = "Personality Traits", 
  className = "" 
}) => {
  const data = [
    {
      trait: 'Helpfulness',
      value: traits.helpfulness * 100,
      fullMark: 100,
    },
    {
      trait: 'Constructiveness',
      value: traits.constructiveness * 100,
      fullMark: 100,
    },
    {
      trait: 'Professionalism',
      value: traits.professionalism * 100,
      fullMark: 100,
    },
    {
      trait: 'Empathy',
      value: traits.empathy * 100,
      fullMark: 100,
    },
    {
      trait: 'Clarity',
      value: traits.clarity * 100,
      fullMark: 100,
    },
    {
      trait: 'Encouragement',
      value: traits.encouragement * 100,
      fullMark: 100,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">
            {data.payload.trait}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Score: {data.value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const getTraitDescription = (trait: string, value: number) => {
    const descriptions: Record<string, Record<string, string>> = {
      'Helpfulness': {
        high: 'Highly supportive and willing to assist',
        medium: 'Generally helpful when needed',
        low: 'Could be more supportive in reviews'
      },
      'Constructiveness': {
        high: 'Provides excellent constructive feedback',
        medium: 'Offers helpful suggestions for improvement',
        low: 'Could focus more on constructive solutions'
      },
      'Professionalism': {
        high: 'Maintains professional tone consistently',
        medium: 'Generally professional in communication',
        low: 'Could improve professional communication'
      },
      'Empathy': {
        high: 'Shows great understanding and empathy',
        medium: 'Generally considerate of others',
        low: 'Could show more empathy in reviews'
      },
      'Clarity': {
        high: 'Communicates with excellent clarity',
        medium: 'Generally clear in explanations',
        low: 'Could improve clarity of communication'
      },
      'Encouragement': {
        high: 'Very encouraging and positive',
        medium: 'Generally supportive and positive',
        low: 'Could be more encouraging in reviews'
      }
    };

    const level = value >= 70 ? 'high' : value >= 40 ? 'medium' : 'low';
    return descriptions[trait]?.[level] || 'No description available';
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="trait" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {item.trait}
            </div>
            <div className="text-lg font-bold text-primary-600">
              {item.value.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getTraitDescription(item.trait, item.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalityRadarChart;
