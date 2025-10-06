import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/apiService';

// Create the context
const AppContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  dashboardData: {
    metrics: {},
    recentActivity: [],
    topRepositories: [],
    pullRequests: [],
    issues: [],
    analytics: {}
  },
  currentPage: 'overview',
  filters: {
    prStatus: 'all',
    issueStatus: 'all',
    repository: 'all',
    timeRange: '7d'
  }
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_FILTERS: 'SET_FILTERS',
  UPDATE_PULL_REQUEST: 'UPDATE_PULL_REQUEST',
  UPDATE_ISSUE: 'UPDATE_ISSUE'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case actionTypes.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        isLoading: false 
      };
    
    case actionTypes.LOGOUT:
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        dashboardData: initialState.dashboardData
      };
    
    case actionTypes.SET_DASHBOARD_DATA:
      return { 
        ...state, 
        dashboardData: { ...state.dashboardData, ...action.payload },
        isLoading: false 
      };
    
    case actionTypes.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    
    case actionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case actionTypes.UPDATE_PULL_REQUEST:
      const updatedPRs = state.dashboardData.pullRequests.map(pr => 
        pr.id === action.payload.id ? { ...pr, ...action.payload.updates } : pr
      );
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          pullRequests: updatedPRs
        }
      };
    
    case actionTypes.UPDATE_ISSUE:
      const updatedIssues = state.dashboardData.issues.map(issue => 
        issue.id === action.payload.id ? { ...issue, ...action.payload.updates } : issue
      );
      return {
        ...state,
        dashboardData: {
          ...state.dashboardData,
          issues: updatedIssues
        }
      };
    
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = {
    setLoading: (loading) => dispatch({ type: actionTypes.SET_LOADING, payload: loading }),
    
    setError: (error) => dispatch({ type: actionTypes.SET_ERROR, payload: error }),
    
    clearError: () => dispatch({ type: actionTypes.CLEAR_ERROR }),
    
    setUser: (user) => dispatch({ type: actionTypes.SET_USER, payload: user }),
    
    logout: () => {
      apiClient.logout();
      dispatch({ type: actionTypes.LOGOUT });
    },
    
    setDashboardData: (data) => dispatch({ type: actionTypes.SET_DASHBOARD_DATA, payload: data }),
    
    setCurrentPage: (page) => dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: page }),
    
    setFilters: (filters) => dispatch({ type: actionTypes.SET_FILTERS, payload: filters }),
    
    updatePullRequest: (id, updates) => 
      dispatch({ type: actionTypes.UPDATE_PULL_REQUEST, payload: { id, updates } }),
    
    updateIssue: (id, updates) => 
      dispatch({ type: actionTypes.UPDATE_ISSUE, payload: { id, updates } })
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      actions.setLoading(true);
      const [overviewRes, prsRes, issuesRes, mentorshipRes, impactRes] = await Promise.all([
        apiService.getDashboardData(),
        apiService.getReviewsData(),
        apiService.getIssuesData(),
        apiService.getMentorshipData(),
        apiService.getImpactData()
      ]);

      if (overviewRes.success && prsRes.success && issuesRes.success) {
        actions.setDashboardData({
          metrics: overviewRes.data.metrics,
          recentActivity: overviewRes.data.recentActivity,
          topRepositories: overviewRes.data.topRepositories,
          pullRequests: prsRes.data.reviews || [],
          issues: issuesRes.data || [],
          mentorship: mentorshipRes.data || {},
          impact: impactRes.data || {},
          sentimentData: prsRes.data.sentimentData || [],
          personalityData: prsRes.data.personalityData || []
        });
      }
    } catch (error) {
      actions.setError(error.message);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a stored token
        if (apiService.token && apiService.username) {
          // Try to get user data to validate token
          const response = await apiService.getProfileData(apiService.username);
          if (response.success) {
            actions.setUser(response.data.user);
            loadDashboardData();
          }
        }
      } catch (error) {
        // User not authenticated, stay on login page
        console.log('User not authenticated');
      }
    };

    checkAuth();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if (state.isAuthenticated) {
      loadDashboardData();
    }
  }, [state.filters]);

  const value = {
    ...state,
    ...actions,
    loadDashboardData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { actionTypes };