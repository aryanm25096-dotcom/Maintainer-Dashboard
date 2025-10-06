import React from "react";
import { SentimentAnalysis } from './pages/SentimentAnalysis';
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
import { Analytics } from "./pages/Analytics";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Toaster } from "./components/ui/sonner";

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
  );
}