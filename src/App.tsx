import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index';
import { useAuth } from './store/hooks';
import { verifyToken } from './store/slices/authSlice';
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

// WebSocket integration
import { webSocketService } from './store/index';
import { useWebSocket } from './hooks/websocketHooks';

const queryClient = new QueryClient();

// WebSocket connection manager component
const WebSocketManager = () => {
  const { isAuthenticated, user } = useAuth();
  const { isConnected, error, clearWebSocketError } = useWebSocket();

  useEffect(() => {
    // Connect to WebSocket when authenticated
    if (isAuthenticated && user?.token) {
      webSocketService.connect(user.token);
    } else {
      // Disconnect when not authenticated
      webSocketService.disconnect();
    }

    return () => {
      // Cleanup on unmount
      webSocketService.disconnect();
    };
  }, [isAuthenticated, user?.token]);

  // Handle network status changes
  useEffect(() => {
    const handleOnline = () => {
      if (isAuthenticated && user?.token && !isConnected) {
        webSocketService.connect(user.token);
      }
    };

    const handleOffline = () => {
      webSocketService.disconnect();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isAuthenticated, user?.token, isConnected]);

  return <></>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, dispatch } = useAuth();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]);

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   );
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="hackmate-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {/* WebSocket Manager */}
          <WebSocketManager />
          
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <Navbar />
              <main className="pt-20">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route 
                    path="/dashboard" 
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/lobbies" 
                    element={isAuthenticated ? <Lobbies /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/teams" 
                    element={isAuthenticated ? <Teams /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/analytics" 
                    element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/profile" 
                    element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/settings" 
                    element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
                  />
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
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;