import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from './use-auth';
import { queryClient } from '@/lib/queryClient';

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Send authentication message
      newSocket.send(JSON.stringify({ 
        type: 'auth', 
        userId: user.id 
      }));
    };
    
    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Handle different message types
        if (data.type === 'transaction') {
          // Invalidate relevant queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
          queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
          queryClient.invalidateQueries({ queryKey: ['/api/transactions/recent'] });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    newSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (user) {
          setSocket(null);
        }
      }, 5000);
    };
    
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      newSocket.close();
    };
  }, [user, socket === null]);

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
