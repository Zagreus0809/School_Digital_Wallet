import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import StatusBar from "@/components/StatusBar";
import QrGenerator from "@/components/QrGenerator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/use-websocket";

export default function ReceivePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [amount, setAmount] = useState<string>("");
  const { isConnected } = useWebSocket();

  // Query wallet details
  const { data: wallet } = useQuery({
    queryKey: ["/api/wallet"],
    enabled: !!user,
  });

  const qrValue = amount ? 
    JSON.stringify({ walletId: user?.walletId, amount: parseFloat(amount) }) : 
    JSON.stringify({ walletId: user?.walletId });

  const handleBack = () => {
    setLocation("/");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "School Digital Wallet",
          text: `Payment request from ${user?.fullName}${amount ? ` for $${amount}` : ""}`,
          url: `${window.location.origin}/send-confirmation/${user?.walletId}${amount ? `/${amount}` : ""}`
        });
      } else {
        // Fallback for browsers that don't support share API
        navigator.clipboard.writeText(`${window.location.origin}/send-confirmation/${user?.walletId}${amount ? `/${amount}` : ""}`);
        alert("Payment URL copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
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
            
            <h2 className="text-xl font-semibold mb-6">Receive Money</h2>
            
            <div className="flex flex-col items-center justify-center flex-grow">
              <div className="qr-container mb-6 mx-auto">
                <QrGenerator 
                  value={qrValue} 
                  size={256} 
                  bgColor="#ffffff" 
                  fgColor="#000000" 
                  level="M"
                  includeMargin={true}
                />
              </div>
              
              <p className="text-muted-foreground text-center mb-2">Your personal payment QR code</p>
              <p className="font-medium text-center mb-4">{user?.walletId}</p>
              
              <div className="w-full max-w-xs">
                <div className="mb-4">
                  <label className="block text-muted-foreground text-sm mb-1">
                    Amount (optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      className="pl-8"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-6">
                  <Button
                    variant="outline"
                    className="flex-1 border-primary text-primary"
                    onClick={handleShare}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                    <span>Share</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex-1 border-primary text-primary"
                    onClick={() => {
                      const canvas = document.querySelector("canvas");
                      if (canvas) {
                        const image = canvas.toDataURL("image/png");
                        const link = document.createElement("a");
                        link.href = image;
                        link.download = "school-wallet-qrcode.png";
                        link.click();
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Save</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
