import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { useAuth } from './store/hooks';
import { verifyToken } from './store/slices/authSlice';
// import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Lobbies from "./pages/Lobbies";
import Teams from "./pages/Teams";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { LoadingSpinner } from "./components/utils/LoadingSpinner";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, dispatch } = useAuth();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]);

  if (true) {
    return <LoadingSpinner  size = 'md' className="flex justify-center align-middle " />;
  }
  return  <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="hackmate-ui-theme">
        <TooltipProvider>
          <Toaster />
        <Sonner />
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="pt-20">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/lobbies" element={<Lobbies />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
