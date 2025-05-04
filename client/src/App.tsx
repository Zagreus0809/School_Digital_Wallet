import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import ReceivePage from "@/pages/receive";
import SendPage from "@/pages/send";
import SendConfirmationPage from "@/pages/send-confirmation";
import HistoryPage from "@/pages/history";
import ProfilePage from "@/pages/profile";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ProtectedRoute from "@/components/ProtectedRoute";
import { WebSocketProvider } from "@/hooks/use-websocket";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      <Route path="/">
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/receive">
        <ProtectedRoute>
          <ReceivePage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/send">
        <ProtectedRoute>
          <SendPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/send-confirmation/:walletId/:amount?/:note?">
        <ProtectedRoute>
          <SendConfirmationPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/history">
        <ProtectedRoute>
          <HistoryPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          <Router />
          <Toaster />
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
