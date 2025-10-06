import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Login } from "./pages/Login";
import { Overview } from "./pages/Overview";
import { PRReviews } from "./pages/PRReviews";
import { IssueTriage } from "./pages/IssueTriage";
import { Mentorship } from "./pages/Mentorship";
import { CommunityImpact } from "./pages/CommunityImpact";
import { SentimentAnalysis } from "./pages/SentimentAnalysis";
import { Analytics } from "./pages/Analytics";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Toaster } from "./components/ui/sonner";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1 style={{ color: "#dc2626" }}>Something went wrong</h1>
          <p>Please check the console for errors and refresh the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#3b82f6", 
              color: "white", 
              border: "none", 
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useApp();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Main App Routes component
function AppRoutes() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/reviews" element={<PRReviews />} />
        <Route path="/issues" element={<IssueTriage />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/impact" element={<CommunityImpact />} />
        <Route path="/sentiment" element={<SentimentAnalysis />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

// Main App component
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <Router>
            <div className="App">
              <AppRoutes />
              <Toaster />
            </div>
          </Router>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}