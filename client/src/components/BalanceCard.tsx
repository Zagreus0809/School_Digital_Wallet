import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BalanceCardProps {
  balance: string;
  isLoading: boolean;
  onReceive: () => void;
  onSend: () => void;
}

export default function BalanceCard({ balance, isLoading, onReceive, onSend }: BalanceCardProps) {
  const formattedBalance = isLoading 
    ? "Loading..." 
    : `$${parseFloat(balance).toFixed(2)}`;
  
  return (
    <div className="bg-primary text-primary-foreground rounded-xl p-5 shadow-lg mb-6">
      <p className="text-primary-foreground/80 text-sm">Current Balance</p>
      
      {isLoading ? (
        <Skeleton className="h-10 w-32 bg-primary-foreground/20 my-2" />
      ) : (
        <h1 className="text-3xl font-semibold font-mono my-2">{formattedBalance}</h1>
      )}
      
      <div className="flex mt-4 justify-between">
        <Button
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 rounded-lg flex flex-col items-center px-4 py-3 flex-1 mr-3"
          onClick={onReceive}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
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
          <span className="text-sm">Receive</span>
        </Button>
        
        <Button
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 rounded-lg flex flex-col items-center px-4 py-3 flex-1"
          onClick={onSend}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span className="text-sm">Send</span>
        </Button>
      </div>
    </div>
  );
}
