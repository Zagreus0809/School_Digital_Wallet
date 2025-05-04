import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import StatusBar from "@/components/StatusBar";
import BottomNavigation from "@/components/BottomNavigation";
import { useWebSocket } from "@/hooks/use-websocket";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { isConnected } = useWebSocket();

  return (
    <div className="flex flex-col h-full">
      <StatusBar isConnected={isConnected} />
      
      <div className="pt-14 pb-16 h-screen overflow-y-auto">
        <div className="px-4 py-6">
          <h2 className="text-xl font-semibold mb-6">My Profile</h2>
          
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-lg">{user?.fullName}</p>
              <p className="text-muted-foreground">{user?.walletId}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-card rounded-lg shadow-sm p-4">
              <p className="text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm p-4">
              <p className="text-muted-foreground mb-1">Phone</p>
              <p className="font-medium">{user?.phone || "-"}</p>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm p-4">
              <p className="text-muted-foreground mb-1">Student ID</p>
              <p className="font-medium">{user?.studentId || "-"}</p>
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-muted-foreground">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Security Settings</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-muted-foreground">
                  <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
                  <polyline points="15,9 18,9 18,11" />
                  <path d="M6 10a1 1 0 0 0 1 1h.01a1 1 0 0 0 1-1 1 1 0 0 0-1-1H7a1 1 0 0 0-1 1Z" />
                </svg>
                <span>Notification Preferences</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-muted-foreground">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span>Help Center</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            
            <Button 
              variant="ghost"
              className="w-full flex items-center justify-between p-4 bg-card rounded-lg shadow-sm text-destructive" 
              onClick={logout}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-destructive">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sign Out</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
      
      <BottomNavigation currentPage="profile" />
    </div>
  );
}
