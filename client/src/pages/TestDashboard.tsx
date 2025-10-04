import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Info,
  BarChart3,
  Smartphone,
  Eye,
  Zap
} from 'lucide-react';
import DashboardTester, { testAccessibility, testMobileResponsiveness } from '../utils/testUtils';

interface TestDashboardProps {
  className?: string;
}

const TestDashboard: React.FC<TestDashboardProps> = ({ className = "" }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testSuite, setTestSuite] = useState<any>(null);
  const [accessibilityResults, setAccessibilityResults] = useState<any>(null);
  const [mobileResults, setMobileResults] = useState<any>(null);
  const [report, setReport] = useState('');

  const runTests = async () => {
    setIsRunning(true);
    const tester = new DashboardTester();
    
    try {
      const results = await tester.runAllTests();
      setTestSuite(results);
      
      // Run additional tests
      const a11yResults = testAccessibility();
      setAccessibilityResults(a11yResults);
      
      const mobileTestResults = testMobileResponsiveness();
      setMobileResults(mobileTestResults);
      
      // Generate report
      const testReport = tester.generateReport();
      setReport(testReport);
      
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-test-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusColor = (passed: boolean) => {
    return passed 
      ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
      : 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200';
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Dashboard Test Suite
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Comprehensive testing for all maintainer dashboard features
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="btn-primary flex items-center space-x-2"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isRunning ? 'Running Tests...' : 'Run All Tests'}</span>
          </button>
          
          {report && (
            <button
              onClick={downloadReport}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Test Results */}
      {testSuite && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Test Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Tests</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {testSuite.totalTests}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Passed</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      {testSuite.passedTests}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Failed</span>
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-red-600">
                      {testSuite.failedTests}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {testSuite.duration}ms
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round((testSuite.passedTests / testSuite.totalTests) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Success Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Details */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Test Results
              </h3>
              
              <div className="space-y-3">
                {testSuite.results.map((result: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getStatusColor(result.passed)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.passed)}
                        <span className="font-medium">{result.test}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{result.duration}ms</span>
                      </div>
                    </div>
                    {!result.passed && (
                      <div className="mt-2 text-sm opacity-75">
                        {result.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Results */}
      {accessibilityResults && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Accessibility Test Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {accessibilityResults.score}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Accessibility Score
                </div>
              </div>
            </div>
            
            <div>
              {accessibilityResults.issues.length > 0 ? (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Issues Found:
                  </h4>
                  <ul className="space-y-1">
                    {accessibilityResults.issues.map((issue: string, index: number) => (
                      <li key={index} className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  No accessibility issues found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsiveness Results */}
      {mobileResults && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Mobile Responsiveness Test Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mobileResults.map((result: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.issues.length === 0
                    ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700'
                    : 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white mb-2">
                  {result.width}px
                </div>
                {result.issues.length === 0 ? (
                  <div className="text-green-600 dark:text-green-400 text-sm flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    No issues
                  </div>
                ) : (
                  <div>
                    <div className="text-yellow-600 dark:text-yellow-400 text-sm mb-1">
                      {result.issues.length} issue(s)
                    </div>
                    <ul className="text-xs space-y-1">
                      {result.issues.map((issue: string, issueIndex: number) => (
                        <li key={issueIndex} className="text-yellow-700 dark:text-yellow-300">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Performance Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {performance.now().toFixed(0)}ms
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page Load Time
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {document.querySelectorAll('*').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              DOM Elements
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0)}MB
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Memory Usage
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;
