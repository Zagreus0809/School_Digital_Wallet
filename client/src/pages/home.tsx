import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useWebSocket } from "@/hooks/use-websocket";
import StatusBar from "@/components/StatusBar";
import BottomNavigation from "@/components/BottomNavigation";
import BalanceCard from "@/components/BalanceCard";
import QuickActions from "@/components/QuickActions";
import TransactionCard from "@/components/TransactionCard";
import { Transaction } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { isConnected } = useWebSocket();

  // Query wallet balance
  const { data: wallet, isLoading: isLoadingWallet } = useQuery({
    queryKey: ["/api/wallet"],
    enabled: !!user,
  });

  // Query recent transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/recent"],
    enabled: !!user,
  });

  const handleReceiveMoney = () => {
    setLocation("/receive");
  };

  const handleSendMoney = () => {
    setLocation("/send");
  };

  return (
    <div className="flex flex-col h-full">
      <StatusBar isConnected={isConnected} />
      
      <div className="pt-14 pb-16 h-screen overflow-y-auto">
        <div className="px-4 py-6">
          
          {/* Welcome Section */}
          <div className="mb-6">
            <p className="text-muted-foreground">Welcome back,</p>
            <h2 className="text-xl font-semibold">{user?.fullName}</h2>
          </div>
          
          {/* Balance Card */}
          <BalanceCard 
            balance={wallet?.balance || "0.00"} 
            isLoading={isLoadingWallet}
            onReceive={handleReceiveMoney}
            onSend={handleSendMoney}
          />
          
          {/* Quick Actions */}
          <QuickActions 
            onHistory={() => setLocation("/history")} 
            onFriends={() => {}}
          />
          
          {/* Recent Transactions */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-medium">Recent Transactions</h3>
              <button 
                className="text-primary text-sm"
                onClick={() => setLocation("/history")}
              >
                View All
              </button>
            </div>
            
            {isLoadingTransactions ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-lg p-4 shadow-sm animate-pulse h-16"></div>
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <TransactionCard 
                    key={transaction.id} 
                    transaction={transaction} 
                    currentUserId={user?.id || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <button 
        className="fixed bottom-20 right-4 bg-secondary text-secondary-foreground w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-30"
        onClick={handleReceiveMoney}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      </button>
      
      <BottomNavigation currentPage="home" />
    </div>
  );
}
