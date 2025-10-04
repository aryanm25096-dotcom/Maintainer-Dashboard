import axios from 'axios';

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  created_at: string;
  updated_at: string;
}

interface GitHubPR {
  number: number;
  title: string;
  body: string;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  user: GitHubUser;
  head: {
    ref: string;
  };
  base: {
    ref: string;
  };
}

interface GitHubPRReview {
  id: number;
  body: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED';
  html_url: string;
  created_at: string;
  user: GitHubUser;
  pull_request_url: string;
}

interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  html_url: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  labels: Array<{
    name: string;
    color: string;
  }>;
  assignees: GitHubUser[];
  user: GitHubUser;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  html_url: string;
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
  files?: Array<{
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
  }>;
}

export class GitHubService {
  private token: string;
  private baseURL = 'https://api.github.com';

  constructor(token: string) {
    this.token = token;
  }

  private async makeRequest<T>(endpoint: string, params?: any): Promise<T> {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MaintainerDashboard/1.0',
        },
        params,
      });
      return response.data;
    } catch (error) {
      console.error(`GitHub API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // User methods
  async getUser(username: string): Promise<GitHubUser> {
    return this.makeRequest<GitHubUser>(`/users/${username}`);
  }

  async getAuthenticatedUser(): Promise<GitHubUser> {
    return this.makeRequest<GitHubUser>('/user');
  }

  // Repository methods
  async getUserRepositories(username: string, type: 'all' | 'owner' | 'public' | 'private' = 'all'): Promise<GitHubRepository[]> {
    return this.makeRequest<GitHubRepository[]>(`/users/${username}/repos`, { type, sort: 'updated', per_page: 100 });
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.makeRequest<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  // PR methods
  async getPullRequests(owner: string, repo: string, state: 'all' | 'open' | 'closed' = 'all'): Promise<GitHubPR[]> {
    return this.makeRequest<GitHubPR[]>(`/repos/${owner}/${repo}/pulls`, { state, per_page: 100 });
  }

  async getPullRequestReviews(owner: string, repo: string, prNumber: number): Promise<GitHubPRReview[]> {
    return this.makeRequest<GitHubPRReview[]>(`/repos/${owner}/${repo}/pulls/${prNumber}/reviews`);
  }

  async getPullRequestCommits(owner: string, repo: string, prNumber: number): Promise<GitHubCommit[]> {
    return this.makeRequest<GitHubCommit[]>(`/repos/${owner}/${repo}/pulls/${prNumber}/commits`);
  }

  // Issue methods
  async getIssues(owner: string, repo: string, state: 'all' | 'open' | 'closed' = 'all'): Promise<GitHubIssue[]> {
    return this.makeRequest<GitHubIssue[]>(`/repos/${owner}/${repo}/issues`, { state, per_page: 100 });
  }

  async getIssueComments(owner: string, repo: string, issueNumber: number): Promise<any[]> {
    return this.makeRequest<any[]>(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`);
  }

  // Contribution methods
  async getContributions(username: string, from?: string, to?: string): Promise<any> {
    const params: any = {};
    if (from) params.since = from;
    if (to) params.until = to;
    
    return this.makeRequest<any>(`/users/${username}/events`, params);
  }

  async getRepositoryContributors(owner: string, repo: string): Promise<any[]> {
    return this.makeRequest<any[]>(`/repos/${owner}/${repo}/contributors`);
  }

  // Search methods
  async searchIssues(query: string, sort: 'created' | 'updated' | 'comments' = 'created'): Promise<{ items: GitHubIssue[] }> {
    return this.makeRequest<{ items: GitHubIssue[] }>('/search/issues', { q: query, sort, per_page: 100 });
  }

  async searchPullRequests(query: string, sort: 'created' | 'updated' | 'comments' = 'created'): Promise<{ items: GitHubPR[] }> {
    return this.makeRequest<{ items: GitHubPR[] }>('/search/issues', { q: query, sort, per_page: 100 });
  }

  // Activity methods
  async getUserActivity(username: string, page: number = 1): Promise<any[]> {
    return this.makeRequest<any[]>(`/users/${username}/events`, { page, per_page: 100 });
  }

  async getRepositoryActivity(owner: string, repo: string): Promise<any[]> {
    return this.makeRequest<any[]>(`/repos/${owner}/${repo}/events`);
  }

  // Helper methods for maintainer analysis
  async getMaintainerActivity(username: string, repositories: string[]): Promise<{
    prReviews: GitHubPRReview[];
    issueTriage: any[];
    mentorship: any[];
    contributions: any[];
  }> {
    const results = {
      prReviews: [] as GitHubPRReview[],
      issueTriage: [] as any[],
      mentorship: [] as any[],
      contributions: [] as any[],
    };

    // Get PR reviews across all repositories
    for (const repo of repositories) {
      try {
        const [owner, repoName] = repo.split('/');
        const prs = await this.getPullRequests(owner, repoName);
        
        for (const pr of prs) {
          const reviews = await this.getPullRequestReviews(owner, repoName, pr.number);
          const maintainerReviews = reviews.filter(review => 
            review.user.login === username
          );
          results.prReviews.push(...maintainerReviews);
        }
      } catch (error) {
        console.error(`Error fetching PR reviews for ${repo}:`, error);
      }
    }

    // Get issue triage activities
    for (const repo of repositories) {
      try {
        const [owner, repoName] = repo.split('/');
        const issues = await this.getIssues(owner, repoName);
        
        for (const issue of issues) {
          const comments = await this.getIssueComments(owner, repoName, issue.number);
          const maintainerComments = comments.filter(comment => 
            comment.user.login === username
          );
          results.issueTriage.push(...maintainerComments);
        }
      } catch (error) {
        console.error(`Error fetching issue triage for ${repo}:`, error);
      }
    }

    // Get user activity for mentorship analysis
    try {
      const activity = await this.getUserActivity(username);
      results.mentorship = activity.filter(event => 
        event.type === 'IssueCommentEvent' || 
        event.type === 'PullRequestReviewEvent'
      );
      results.contributions = activity;
    } catch (error) {
      console.error(`Error fetching user activity:`, error);
    }

    return results;
  }
}
