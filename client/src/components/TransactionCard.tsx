import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface TransactionCardProps {
  transaction: Transaction;
  currentUserId: number;
  showNote?: boolean;
}

export default function TransactionCard({ transaction, currentUserId, showNote = false }: TransactionCardProps) {
  // Query to get sender and receiver details
  const { data: sender } = useQuery({
    queryKey: [`/api/users/${transaction.senderId}`],
    enabled: !!transaction.senderId,
  });
  
  const { data: receiver } = useQuery({
    queryKey: [`/api/users/${transaction.receiverId}`],
    enabled: !!transaction.receiverId,
  });
  
  const isIncoming = transaction.receiverId === currentUserId;
  const isOutgoing = transaction.senderId === currentUserId;
  const amount = parseFloat(transaction.amount.toString());
  
  // Determine transaction details based on direction
  const name = isIncoming 
    ? `Received from ${sender?.fullName || 'Unknown'}`
    : `Sent to ${receiver?.fullName || 'Unknown'}`;
  
  const timeAgo = transaction.createdAt
    ? formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })
    : '';
  
  return (
    <div className="bg-card rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className={isIncoming ? "transaction-incoming" : "transaction-outgoing"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isIncoming ? "text-success" : "text-destructive"}>
              {isIncoming ? (
                <path d="m6 9 6 6 6-6" />
              ) : (
                <path d="m6 15 6-6 6 6" />
              )}
            </svg>
          </div>
          <div className="ml-3">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <div className={`font-mono font-medium ${isIncoming ? "text-success" : "text-destructive"}`}>
          {isIncoming ? '+' : '-'}₱{amount.toFixed(2)}
        </div>
      </div>
      
      {showNote && transaction.note && (
        <p className="text-xs text-muted-foreground ml-11">{transaction.note}</p>
      )}
    </div>
  );
}
