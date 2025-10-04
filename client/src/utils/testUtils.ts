// Test utilities for maintainer dashboard
export interface TestResult {
  test: string;
  passed: boolean;
  message: string;
  duration: number;
}

export interface TestSuite {
  name: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
}

export class DashboardTester {
  private results: TestResult[] = [];

  async runTest(testName: string, testFunction: () => Promise<boolean> | boolean): Promise<TestResult> {
    const startTime = Date.now();
    let passed = false;
    let message = '';

    try {
      const result = await testFunction();
      passed = result;
      message = passed ? 'Test passed' : 'Test failed';
    } catch (error) {
      passed = false;
      message = `Test failed with error: ${error}`;
    }

    const duration = Date.now() - startTime;
    const testResult: TestResult = {
      test: testName,
      passed,
      message,
      duration
    };

    this.results.push(testResult);
    return testResult;
  }

  async testGitHubLogin(): Promise<TestResult> {
    return this.runTest('GitHub Login', () => {
      // Check if GitHub OAuth is configured
      const hasGitHubConfig = process.env.REACT_APP_GITHUB_CLIENT_ID !== undefined;
      return hasGitHubConfig;
    });
  }

  async testDataFetching(): Promise<TestResult> {
    return this.runTest('Data Fetching', async () => {
      try {
        // Test API endpoints
        const response = await fetch('/api/maintainer/dashboard');
        return response.ok;
      } catch (error) {
        return false;
      }
    });
  }

  async testSentimentAnalysis(): Promise<TestResult> {
    return this.runTest('Sentiment Analysis', () => {
      // Check if sentiment analysis packages are available
      const hasSentimentPackage = typeof window !== 'undefined' && 'sentiment' in window;
      return hasSentimentPackage;
    });
  }

  async testChartsRendering(): Promise<TestResult> {
    return this.runTest('Charts Rendering', () => {
      // Check if chart components are rendered
      const chartElements = document.querySelectorAll('[data-testid*="chart"]');
      return chartElements.length > 0;
    });
  }

  async testMobileResponsiveness(): Promise<TestResult> {
    return this.runTest('Mobile Responsiveness', () => {
      // Check if mobile styles are applied
      const mobileElements = document.querySelectorAll('.mobile-optimized');
      return mobileElements.length > 0;
    });
  }

  async testAccessibility(): Promise<TestResult> {
    return this.runTest('Accessibility', () => {
      // Check for ARIA labels and keyboard navigation
      const hasAriaLabels = document.querySelectorAll('[aria-label]').length > 0;
      const hasKeyboardSupport = document.querySelectorAll('[tabindex]').length > 0;
      return hasAriaLabels && hasKeyboardSupport;
    });
  }

  async testExportFunctionality(): Promise<TestResult> {
    return this.runTest('Export Functionality', () => {
      // Check if export buttons are present
      const exportButtons = document.querySelectorAll('[data-testid*="export"]');
      return exportButtons.length > 0;
    });
  }

  async testDarkTheme(): Promise<TestResult> {
    return this.runTest('Dark Theme', () => {
      // Check if dark theme classes are applied
      const darkElements = document.querySelectorAll('.dark');
      return darkElements.length > 0;
    });
  }

  async testErrorHandling(): Promise<TestResult> {
    return this.runTest('Error Handling', () => {
      // Check if error boundaries are present
      const errorBoundaries = document.querySelectorAll('[data-testid*="error-boundary"]');
      return errorBoundaries.length > 0;
    });
  }

  async testLoadingStates(): Promise<TestResult> {
    return this.runTest('Loading States', () => {
      // Check if loading components are present
      const loadingElements = document.querySelectorAll('[data-testid*="loading"]');
      return loadingElements.length > 0;
    });
  }

  async testTooltips(): Promise<TestResult> {
    return this.runTest('Tooltips', () => {
      // Check if tooltip components are present
      const tooltipElements = document.querySelectorAll('[data-testid*="tooltip"]');
      return tooltipElements.length > 0;
    });
  }

  async testQRCodeGeneration(): Promise<TestResult> {
    return this.runTest('QR Code Generation', () => {
      // Check if QR code components are present
      const qrElements = document.querySelectorAll('[data-testid*="qr"]');
      return qrElements.length > 0;
    });
  }

  async testSocialSharing(): Promise<TestResult> {
    return this.runTest('Social Sharing', () => {
      // Check if social sharing components are present
      const socialElements = document.querySelectorAll('[data-testid*="social"]');
      return socialElements.length > 0;
    });
  }

  async runAllTests(): Promise<TestSuite> {
    const startTime = Date.now();
    this.results = [];

    // Run all tests
    await this.testGitHubLogin();
    await this.testDataFetching();
    await this.testSentimentAnalysis();
    await this.testChartsRendering();
    await this.testMobileResponsiveness();
    await this.testAccessibility();
    await this.testExportFunctionality();
    await this.testDarkTheme();
    await this.testErrorHandling();
    await this.testLoadingStates();
    await this.testTooltips();
    await this.testQRCodeGeneration();
    await this.testSocialSharing();

    const duration = Date.now() - startTime;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = this.results.filter(r => !r.passed).length;

    return {
      name: 'Maintainer Dashboard Test Suite',
      results: this.results,
      totalTests: this.results.length,
      passedTests,
      failedTests,
      duration
    };
  }

  getResults(): TestResult[] {
    return this.results;
  }

  getPassedTests(): TestResult[] {
    return this.results.filter(r => r.passed);
  }

  getFailedTests(): TestResult[] {
    return this.results.filter(r => !r.passed);
  }

  generateReport(): string {
    const suite = {
      name: 'Maintainer Dashboard Test Suite',
      results: this.results,
      totalTests: this.results.length,
      passedTests: this.results.filter(r => r.passed).length,
      failedTests: this.results.filter(r => !r.passed).length,
      duration: this.results.reduce((sum, r) => sum + r.duration, 0)
    };

    let report = `# ${suite.name}\n\n`;
    report += `**Total Tests:** ${suite.totalTests}\n`;
    report += `**Passed:** ${suite.passedTests}\n`;
    report += `**Failed:** ${suite.failedTests}\n`;
    report += `**Duration:** ${suite.duration}ms\n\n`;

    report += `## Test Results\n\n`;
    suite.results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      report += `${status} **${result.test}** (${result.duration}ms)\n`;
      if (!result.passed) {
        report += `   - ${result.message}\n`;
      }
    });

    return report;
  }
}

// Performance testing utilities
export const testPerformance = async (testName: string, testFunction: () => Promise<any>) => {
  const startTime = performance.now();
  const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
  
  try {
    const result = await testFunction();
    const endTime = performance.now();
    const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    return {
      testName,
      duration: endTime - startTime,
      memoryUsed: endMemory - startMemory,
      success: true,
      result
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      testName,
      duration: endTime - startTime,
      memoryUsed: 0,
      success: false,
      error: error
    };
  }
};

// Accessibility testing utilities
export const testAccessibility = () => {
  const issues: string[] = [];
  
  // Check for missing alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} images missing alt text`);
  }
  
  // Check for missing ARIA labels
  const buttonsWithoutAria = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  if (buttonsWithoutAria.length > 0) {
    issues.push(`${buttonsWithoutAria.length} buttons missing ARIA labels`);
  }
  
  // Check for color contrast
  const lowContrastElements = document.querySelectorAll('[style*="color"]');
  // This would need a more sophisticated color contrast checker
  
  return {
    issues,
    score: issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 10))
  };
};

// Mobile responsiveness testing
export const testMobileResponsiveness = () => {
  const viewportWidths = [320, 375, 414, 768, 1024, 1440];
  const results: { width: number; issues: string[] }[] = [];
  
  viewportWidths.forEach(width => {
    const issues: string[] = [];
    
    // Simulate viewport width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    
    // Check for horizontal scroll
    if (document.documentElement.scrollWidth > width) {
      issues.push('Horizontal scroll detected');
    }
    
    // Check for touch targets
    const touchTargets = document.querySelectorAll('button, a, input, select');
    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        issues.push('Touch target too small');
      }
    });
    
    results.push({ width, issues });
  });
  
  return results;
};

export default DashboardTester;
