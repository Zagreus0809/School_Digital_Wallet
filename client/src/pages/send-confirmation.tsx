import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import StatusBar from "@/components/StatusBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";
import SuccessModal from "@/components/SuccessModal";

export default function SendConfirmationPage() {
  const params = useParams();
  const { walletId, amount: paramAmount, note: paramNote } = params;
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [amount, setAmount] = useState(paramAmount || "");
  const [note, setNote] = useState(paramNote || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<any>(null);
  const { isConnected } = useWebSocket();

  // Query recipient info
  const { data: recipient, isLoading } = useQuery({
    queryKey: [`/api/users/wallet/${walletId}`],
    enabled: !!walletId,
  });

  const sendMutation = useMutation({
    mutationFn: async (data: { receiverWalletId: string; amount: string; note?: string }) => {
      const res = await apiRequest("POST", "/api/transactions", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ["/api/wallet"]});
      queryClient.invalidateQueries({queryKey: ["/api/transactions/recent"]});
      setTransactionDetails(data);
      setShowSuccess(true);
      
      // Vibrate on success if supported
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    },
  });

  const handleBack = () => {
    setLocation("/send");
  };

  const handleSendPayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    sendMutation.mutate({
      receiverWalletId: walletId,
      amount,
      note: note || undefined,
    });
  };

  const handleCloseSuccessModal = () => {
    setShowSuccess(false);
    setLocation("/");
  };

  const handleViewReceipt = () => {
    setShowSuccess(false);
    setLocation("/history");
  };

  return (
    <div className="flex flex-col h-full">
      <StatusBar isConnected={isConnected} />
      
      <div className="pt-14 pb-16 h-screen overflow-y-auto">
        <div className="px-4 py-6 h-full">
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <button 
                className="flex items-center text-primary" 
                onClick={handleBack}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>Back</span>
              </button>
            </div>
            
            <h2 className="text-xl font-semibold mb-6">Confirm Payment</h2>
            
            <div className="flex flex-col flex-grow">
              {isLoading ? (
                <div className="bg-card rounded-lg p-5 shadow-sm mb-6 animate-pulse h-24"></div>
              ) : recipient ? (
                <div className="bg-card rounded-lg p-5 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-muted-foreground">Sending to</p>
                    <div className="bg-primary/10 rounded-full px-3 py-1 text-xs text-primary">School User</div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">{recipient.fullName}</p>
                      <p className="text-xs text-muted-foreground">{recipient.walletId}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-lg p-5 shadow-sm mb-6 text-center">
                  <p className="text-destructive">User not found</p>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-muted-foreground text-sm mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₱</span>
                  <Input 
                    type="number" 
                    className="pl-8 text-xl font-medium" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-muted-foreground text-sm mb-1">Note (optional)</label>
                <Input 
                  type="text" 
                  placeholder="What's this for?" 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-muted-foreground">Transaction Fee</p>
                  <p className="font-medium">₱0.00</p>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <p className="font-medium">Total</p>
                  <p className="font-semibold text-lg">₱{parseFloat(amount || "0").toFixed(2)}</p>
                </div>
                
                <Button 
                  className="w-full py-4 font-medium"
                  onClick={handleSendPayment}
                  disabled={!recipient || !amount || parseFloat(amount) <= 0 || sendMutation.isPending}
                >
                  {sendMutation.isPending ? "Processing..." : "Send Payment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SuccessModal
        show={showSuccess}
        transaction={transactionDetails}
        onClose={handleCloseSuccessModal}
        onViewReceipt={handleViewReceipt}
      />
    </div>
  );
}
