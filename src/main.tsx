import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from './store/index';

const queryClient = new QueryClient();


import { webSocketService } from './store/index';
import { useWebSocket } from './hooks/websocketHooks';
import { useAuth } from './store/hooks.ts';
import { useEffect } from 'react';



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
createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>

                <ThemeProvider
                    defaultTheme="dark"
                    storageKey="hackmate-ui-theme"
                >
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <WebSocketManager />
                        <App />
                    </TooltipProvider>
                </ThemeProvider>
        </QueryClientProvider>
    </Provider>,
);
