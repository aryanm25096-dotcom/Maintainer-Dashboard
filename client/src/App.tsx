import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MaintainerDashboard from './pages/MaintainerDashboard';
import PRReviews from './pages/PRReviews';
import IssueTriage from './pages/IssueTriage';
import MentorshipActivities from './pages/MentorshipActivities';
import CommunityImpact from './pages/CommunityImpact';
import ShareableProfile from './pages/ShareableProfile';
import SentimentAnalysis from './pages/SentimentAnalysis';
import CommunityImpactCalculator from './pages/CommunityImpactCalculator';
import PublicProfile from './pages/PublicProfile';
import TestDashboard from './pages/TestDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import MobileOptimizations from './components/MobileOptimizations';
import AccessibilityEnhancements from './components/AccessibilityEnhancements';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
        <Router>
          <ErrorBoundary>
            <MobileOptimizations>
              <AccessibilityEnhancements>
                <Layout>
                  <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/maintainer" 
                element={
                  <ProtectedRoute>
                    <MaintainerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/maintainer/pr-reviews" 
                element={
                  <ProtectedRoute>
                    <PRReviews />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/maintainer/issue-triage" 
                element={
                  <ProtectedRoute>
                    <IssueTriage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/maintainer/mentorship" 
                element={
                  <ProtectedRoute>
                    <MentorshipActivities />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/maintainer/community-impact" 
                element={
                  <ProtectedRoute>
                    <CommunityImpact />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/maintainer/profile/:username" 
                element={<ShareableProfile />} 
              />
        <Route
          path="/maintainer/sentiment-analysis"
          element={
            <ProtectedRoute>
              <SentimentAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintainer/community-impact-calculator"
          element={
            <ProtectedRoute>
              <CommunityImpactCalculator />
            </ProtectedRoute>
          }
        />
        
        {/* Public Profile Route */}
        <Route
          path="/profile/:username"
          element={<PublicProfile />}
        />
        
        {/* Test Dashboard Route */}
        <Route
          path="/test"
          element={<TestDashboard />}
        />
                  </Routes>
                </Layout>
              </AccessibilityEnhancements>
            </MobileOptimizations>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
