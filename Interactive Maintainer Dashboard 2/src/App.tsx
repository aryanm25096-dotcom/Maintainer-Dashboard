import { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("overview");

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("overview");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <Overview />;
      case "reviews":
        return <PRReviews />;
      case "issues":
        return <IssueTriage />;
      case "mentorship":
        return <Mentorship />;
      case "analytics":
        return <Analytics />;
      case "impact":
        return <CommunityImpact />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <Login onLogin={handleLogin} />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <DashboardLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      >
        {renderPage()}
      </DashboardLayout>
      <Toaster />
    </ThemeProvider>
  );
}