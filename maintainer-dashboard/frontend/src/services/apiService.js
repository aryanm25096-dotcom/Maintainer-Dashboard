// API Service for connecting Figma frontend to backend
// Simple fetch-based service with error handling and loading states

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:5001/auth';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.authURL = AUTH_BASE_URL;
    this.token = localStorage.getItem('github_token');
    this.username = localStorage.getItem('github_username');
  }

  // Set authentication token
  setToken(token, username) {
    this.token = token;
    this.username = username;
    localStorage.setItem('github_token', token);
    localStorage.setItem('github_username', username);
  }

  // Clear authentication
  clearAuth() {
    this.token = null;
    this.username = null;
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_username');
  }

  // Generic fetch wrapper with error handling
  async fetchAPI(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async githubLogin(code) {
    try {
      const response = await fetch(`${this.authURL}/github`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (data.success) {
        this.setToken(data.token, data.user.username);
        return data;
      } else {
        throw new Error(data.error || 'GitHub login failed');
      }
    } catch (error) {
      console.error('GitHub login error:', error);
      throw error;
    }
  }

  // Demo login for testing without GitHub OAuth
  async demoLogin() {
    try {
      // Simulate successful login with demo data
      const demoUser = {
        id: '1',
        username: 'maintainer',
        name: 'John Maintainer',
        email: 'maintainer@example.com',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        repositories: ['user/main-project', 'user/secondary-repo', 'user/utility-lib'],
        role: 'maintainer'
      };

      this.setToken('demo-token', demoUser.username);
      
      return {
        success: true,
        user: demoUser,
        token: 'demo-token'
      };
    } catch (error) {
      console.error('Demo login error:', error);
      throw error;
    }
  }

  // Dashboard data
  async getDashboardData(username = this.username) {
    if (!username) {
      throw new Error('Username required for dashboard data');
    }

    try {
      const data = await this.fetchAPI(`/dashboard?username=${encodeURIComponent(username)}`);
      return data;
    } catch (error) {
      console.error('Dashboard data error:', error);
      // Return fallback data if API fails
      return {
        success: true,
        data: {
          metrics: {
            totalPRReviews: 0,
            issuesTriaged: 0,
            contributorsMentored: 0,
            avgResponseTime: 0
          },
          recentActivity: [],
          topRepositories: []
        }
      };
    }
  }

  // PR reviews with sentiment analysis
  async getReviewsData(username = this.username) {
    if (!username) {
      throw new Error('Username required for reviews data');
    }

    try {
      const data = await this.fetchAPI(`/reviews?username=${encodeURIComponent(username)}`);
      return data;
    } catch (error) {
      console.error('Reviews data error:', error);
      return {
        success: true,
        data: {
          reviews: [],
          sentimentData: [],
          personalityData: []
        }
      };
    }
  }

  // Issues triage data
  async getIssuesData(username = this.username) {
    if (!username) {
      throw new Error('Username required for issues data');
    }

    try {
      const data = await this.fetchAPI(`/issues?username=${encodeURIComponent(username)}`);
      return data;
    } catch (error) {
      console.error('Issues data error:', error);
      return {
        success: true,
        data: []
      };
    }
  }

  // Mentorship activities
  async getMentorshipData(username = this.username) {
    if (!username) {
      throw new Error('Username required for mentorship data');
    }

    try {
      const data = await this.fetchAPI(`/mentorship?username=${encodeURIComponent(username)}`);
      return data;
    } catch (error) {
      console.error('Mentorship data error:', error);
      return {
        success: true,
        data: {
          contributors: [],
          activities: [],
          metrics: {
            totalMentored: 0,
            activeMentees: 0,
            successfulContributions: 0,
            averageResponseTime: 0
          }
        }
      };
    }
  }

  // Community impact data
  async getImpactData(username = this.username) {
    if (!username) {
      throw new Error('Username required for impact data');
    }

    try {
      const data = await this.fetchAPI(`/impact?username=${encodeURIComponent(username)}`);
      return data;
    } catch (error) {
      console.error('Impact data error:', error);
      return {
        success: true,
        data: {
          metrics: {
            totalStars: 0,
            totalForks: 0,
            uniqueContributors: 0,
            repositories: 0,
            followers: 0,
            following: 0
          },
          healthScore: 0,
          trends: {
            starGrowth: '0%',
            contributorGrowth: '0%',
            repositoryGrowth: '0%'
          }
        }
      };
    }
  }

  // Profile data
  async getProfileData(username) {
    if (!username) {
      throw new Error('Username required for profile data');
    }

    try {
      const data = await this.fetchAPI(`/profile/${encodeURIComponent(username)}`);
      return data;
    } catch (error) {
      console.error('Profile data error:', error);
      return {
        success: true,
        data: {
          user: {
            username: username,
            name: 'Unknown User',
            bio: '',
            avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
            location: '',
            company: '',
            blog: '',
            followers: 0,
            following: 0
          },
          repositories: [],
          stats: {
            totalRepos: 0,
            totalStars: 0,
            totalForks: 0
          }
        }
      };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const data = await this.fetchAPI('/health');
      return data;
    } catch (error) {
      console.error('Health check error:', error);
      return { status: 'ERROR', message: error.message };
    }
  }

  // Export functions
  async exportDashboardData(username = this.username, format = 'json') {
    try {
      const data = await this.getDashboardData(username);
      
      if (format === 'csv') {
        return this.convertToCSV(data.data);
      } else if (format === 'pdf') {
        return this.convertToPDF(data.data);
      }
      
      return data;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  // Convert data to CSV format
  convertToCSV(data) {
    const csvData = [];
    
    // Add metrics
    csvData.push(['Metric', 'Value']);
    csvData.push(['Total PR Reviews', data.metrics.totalPRReviews]);
    csvData.push(['Issues Triaged', data.metrics.issuesTriaged]);
    csvData.push(['Contributors Mentored', data.metrics.contributorsMentored]);
    csvData.push(['Avg Response Time', data.metrics.avgResponseTime]);
    
    // Add repositories
    csvData.push(['', '']);
    csvData.push(['Repository', 'Reviews', 'Issues', 'Stars']);
    data.topRepositories.forEach(repo => {
      csvData.push([repo.name, repo.reviews, repo.issues, repo.stars]);
    });
    
    return csvData.map(row => row.join(',')).join('\n');
  }

  // Convert data to PDF (simplified - in real app, use a PDF library)
  convertToPDF(data) {
    // This is a simplified version - in production, use a library like jsPDF
    return {
      type: 'pdf',
      data: data,
      message: 'PDF export would be implemented with jsPDF library'
    };
  }

  // Share profile functionality
  generateShareableLink(username) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/profile/${username}`;
  }

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Clipboard error:', error);
      return false;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;