const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
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
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { username: string; password: string }) {
    const response = await this.request<{
      success: boolean;
      user: any;
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    const response = await this.request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    });
    
    this.clearToken();
    return response;
  }

  async getCurrentUser() {
    return this.request<{ success: boolean; user: any }>('/auth/me');
  }

  // Dashboard endpoints
  async getDashboardOverview() {
    return this.request<{ success: boolean; data: any }>('/dashboard/overview');
  }

  async getPullRequests(params?: {
    status?: string;
    repo?: string;
    priority?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/dashboard/pull-requests?${queryString}` : '/dashboard/pull-requests';
    
    return this.request<{ success: boolean; data: any[] }>(endpoint);
  }

  async getIssues(params?: {
    status?: string;
    repo?: string;
    priority?: string;
    labels?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/dashboard/issues?${queryString}` : '/dashboard/issues';
    
    return this.request<{ success: boolean; data: any[] }>(endpoint);
  }

  async updatePullRequest(id: string, updates: {
    reviewStatus?: string;
    status?: string;
  }) {
    return this.request<{ success: boolean; data: any }>(`/dashboard/pull-requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async updateIssue(id: string, updates: {
    status?: string;
    priority?: string;
    labels?: string[];
  }) {
    return this.request<{ success: boolean; data: any }>(`/dashboard/issues/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // GitHub endpoints
  async getRepositories() {
    return this.request<{ success: boolean; data: any[] }>('/github/repositories');
  }

  async getRepositoryPullRequests(owner: string, repo: string, params?: {
    state?: string;
    page?: number;
    per_page?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/github/repositories/${owner}/${repo}/pulls?${queryString}`
      : `/github/repositories/${owner}/${repo}/pulls`;
    
    return this.request<{ success: boolean; data: any[] }>(endpoint);
  }

  async getRepositoryIssues(owner: string, repo: string, params?: {
    state?: string;
    page?: number;
    per_page?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString 
      ? `/github/repositories/${owner}/${repo}/issues?${queryString}`
      : `/github/repositories/${owner}/${repo}/issues`;
    
    return this.request<{ success: boolean; data: any[] }>(endpoint);
  }

  async getRepositoryStats(owner: string, repo: string) {
    return this.request<{ success: boolean; data: any }>(`/github/repositories/${owner}/${repo}/stats`);
  }

  async syncRepository(owner: string, repo: string) {
    return this.request<{ success: boolean; message: string }>(`/github/sync/${owner}/${repo}`, {
      method: 'POST',
    });
  }

  // Analytics endpoints
  async getAnalyticsDashboard() {
    return this.request<{ success: boolean; data: any }>('/analytics/dashboard');
  }

  async getPRTrends(period?: string) {
    const endpoint = period ? `/analytics/pr-trends?period=${period}` : '/analytics/pr-trends';
    return this.request<{ success: boolean; data: any[] }>(endpoint);
  }

  async getIssueTrends(period?: string) {
    const endpoint = period ? `/analytics/issue-trends?period=${period}` : '/analytics/issue-trends';
    return this.request<{ success: boolean; data: any[] }>(endpoint);
  }

  async getResponseTimeMetrics() {
    return this.request<{ success: boolean; data: any }>('/analytics/response-times');
  }

  async getContributorMetrics() {
    return this.request<{ success: boolean; data: any }>('/analytics/contributors');
  }

  async getRepositoryHealth() {
    return this.request<{ success: boolean; data: any[] }>('/analytics/repository-health');
  }

  async getSentimentAnalysis() {
    return this.request<{ success: boolean; data: any }>('/analytics/sentiment');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;