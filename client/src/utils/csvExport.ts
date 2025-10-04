export interface CSVExportOptions {
  filename?: string;
  headers?: string[];
  delimiter?: string;
}

export const exportToCSV = (
  data: any[],
  options: CSVExportOptions = {}
): void => {
  const {
    filename = `export-${Date.now()}.csv`,
    headers,
    delimiter = ','
  } = options;

  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object or use provided headers
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Headers
    csvHeaders.map(header => `"${header}"`).join(delimiter),
    // Data rows
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        // Handle different data types
        if (value === null || value === undefined) return '""';
        if (typeof value === 'object') return `"${JSON.stringify(value)}"`;
        if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
        return `"${value}"`;
      }).join(delimiter)
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const exportActivityData = (activityData: any[]): void => {
  exportToCSV(activityData, {
    filename: `activity-data-${Date.now()}.csv`,
    headers: ['date', 'type', 'repository', 'title', 'value', 'sentiment', 'url']
  });
};

export const exportImpactMetrics = (metricsData: any[]): void => {
  exportToCSV(metricsData, {
    filename: `impact-metrics-${Date.now()}.csv`,
    headers: [
      'period',
      'newContributors',
      'returningContributors',
      'contributorRetentionRate',
      'contributorGrowthRate',
      'issuesResolved',
      'prsMerged',
      'activityGrowth',
      'repositoryHealthScore',
      'mentorshipScore',
      'contributorQualityImprovement',
      'longTermImpactScore',
      'overallImpactScore',
      'predictedLongTermImpact'
    ]
  });
};

export const exportRepositoryData = (repositoryData: any[]): void => {
  exportToCSV(repositoryData, {
    filename: `repository-data-${Date.now()}.csv`,
    headers: [
      'repository',
      'prReviews',
      'issueTriage',
      'mentorship',
      'contributions',
      'stars',
      'forks',
      'contributors',
      'healthScore',
      'activityScore'
    ]
  });
};

export const exportContributorData = (contributorData: any[]): void => {
  exportToCSV(contributorData, {
    filename: `contributor-data-${Date.now()}.csv`,
    headers: [
      'username',
      'name',
      'firstContribution',
      'lastActivity',
      'totalContributions',
      'isActive',
      'returnRate',
      'qualityScore'
    ]
  });
};

export const exportSentimentData = (sentimentData: any[]): void => {
  exportToCSV(sentimentData, {
    filename: `sentiment-data-${Date.now()}.csv`,
    headers: [
      'date',
      'comment',
      'sentiment',
      'sentimentScore',
      'repository',
      'prNumber',
      'url'
    ]
  });
};
