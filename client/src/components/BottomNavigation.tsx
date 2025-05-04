import { useLocation } from "wouter";

interface BottomNavigationProps {
  currentPage: "home" | "scan" | "history" | "profile";
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-40">
      <div className="flex justify-around items-center h-16">
        <button 
          className={`flex flex-col items-center justify-center w-1/4 h-full ${currentPage === "home" ? "text-primary" : "text-muted-foreground"}`}
          onClick={() => setLocation("/")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button 
          className={`flex flex-col items-center justify-center w-1/4 h-full ${currentPage === "scan" ? "text-primary" : "text-muted-foreground"}`}
          onClick={() => setLocation("/send")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M7 7h.01" />
            <path d="M17 7h.01" />
            <path d="M7 17h.01" />
            <path d="M17 17h.01" />
            <path d="M12 12h.01" />
            <path d="M17 12h.01" />
            <path d="M7 12h.01" />
            <path d="M12 17h.01" />
            <path d="M12 7h.01" />
          </svg>
          <span className="text-xs mt-1">Scan</span>
        </button>
        
        <button 
          className={`flex flex-col items-center justify-center w-1/4 h-full ${currentPage === "history" ? "text-primary" : "text-muted-foreground"}`}
          onClick={() => setLocation("/history")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
          <span className="text-xs mt-1">History</span>
        </button>
        
        <button 
          className={`flex flex-col items-center justify-center w-1/4 h-full ${currentPage === "profile" ? "text-primary" : "text-muted-foreground"}`}
          onClick={() => setLocation("/profile")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}
