import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import StatusBar from "@/components/StatusBar";
import BottomNavigation from "@/components/BottomNavigation";
import TransactionCard from "@/components/TransactionCard";
import { useWebSocket } from "@/hooks/use-websocket";
import { Transaction } from "@shared/schema";

type FilterType = "all" | "received" | "sent";

export default function HistoryPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>("all");
  const { isConnected } = useWebSocket();

  // Query all transactions
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: !!user,
  });

  const filteredTransactions = transactions?.filter(transaction => {
    if (filter === "all") return true;
    if (filter === "received") return transaction.receiverId === user?.id;
    if (filter === "sent") return transaction.senderId === user?.id;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      <StatusBar isConnected={isConnected} />
      
      <div className="pt-14 pb-16 h-screen overflow-y-auto">
        <div className="px-4 py-6">
          <h2 className="text-xl font-semibold mb-6">Transaction History</h2>
          
          {/* Filter tabs */}
          <div className="flex border-b border-border mb-4">
            <button 
              className={`flex-1 py-2 ${filter === "all" ? "border-b-2 border-primary text-primary font-medium" : "text-muted-foreground"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button 
              className={`flex-1 py-2 ${filter === "received" ? "border-b-2 border-primary text-primary font-medium" : "text-muted-foreground"}`}
              onClick={() => setFilter("received")}
            >
              Received
            </button>
            <button 
              className={`flex-1 py-2 ${filter === "sent" ? "border-b-2 border-primary text-primary font-medium" : "text-muted-foreground"}`}
              onClick={() => setFilter("sent")}
            >
              Sent
            </button>
          </div>
          
          {/* Transaction list */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-lg p-4 shadow-sm animate-pulse h-20"></div>
              ))}
            </div>
          ) : filteredTransactions && filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <TransactionCard 
                  key={transaction.id} 
                  transaction={transaction}
                  currentUserId={user?.id || 0}
                  showNote
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNavigation currentPage="history" />
    </div>
  );
}
