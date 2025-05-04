import { useState } from "react";
import { useLocation } from "wouter";
import StatusBar from "@/components/StatusBar";
import QrScanner from "@/components/QrScanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebSocket } from "@/hooks/use-websocket";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function SendPage() {
  const [, setLocation] = useLocation();
  const [showScanner, setShowScanner] = useState(false);
  const [manualWalletId, setManualWalletId] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const { isConnected } = useWebSocket();

  const handleBack = () => {
    setLocation("/");
  };

  const handleScan = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.walletId) {
        const amount = parsedData.amount ? `/${parsedData.amount}` : "";
        setLocation(`/send-confirmation/${parsedData.walletId}${amount}`);
      }
    } catch (error) {
      console.error("Invalid QR code format:", error);
    }
  };

  const handleActivateCamera = () => {
    setShowScanner(true);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualWalletId.trim()) {
      setLocation(`/send-confirmation/${manualWalletId}`);
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
            
            <h2 className="text-xl font-semibold mb-6">Send Money</h2>
            
            <div className="flex flex-col items-center justify-center flex-grow text-center">
              {!showScanner ? (
                <>
                  <div className="w-64 h-64 border-2 border-dashed border-primary rounded-lg mb-6 relative flex items-center justify-center">
                    <div className="absolute inset-0 m-2 border-2 border-primary/40"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary opacity-40">
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
                  </div>
                  
                  <p className="text-muted-foreground mb-4">Position the QR code within the frame to scan</p>
                  
                  <Button 
                    className="bg-primary text-primary-foreground py-3 px-6 flex items-center justify-center mb-4"
                    onClick={handleActivateCamera}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                    <span>Activate Camera</span>
                  </Button>
                  
                  <div className="w-full max-w-xs">
                    <div className="flex items-center my-4">
                      <Separator className="flex-grow" />
                      <span className="text-sm text-muted-foreground px-4">OR</span>
                      <Separator className="flex-grow" />
                    </div>
                    
                    <Button 
                      variant="outline"
                      className="w-full border-primary text-primary flex items-center justify-center" 
                      onClick={() => setShowManualEntry(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      <span>Enter Wallet ID Manually</span>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center">
                  <QrScanner 
                    onScan={handleScan}
                    onError={(error) => console.error(error)}
                    onClose={() => setShowScanner(false)}
                  />
                  <p className="text-muted-foreground mt-4 mb-4">Position the QR code within the frame to scan</p>
                  <Button
                    variant="outline"
                    className="border-primary text-primary"
                    onClick={() => setShowScanner(false)}
                  >
                    Cancel Scanning
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={showManualEntry} onOpenChange={setShowManualEntry}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Wallet ID</DialogTitle>
            <DialogDescription>
              Enter the recipient's wallet ID to send money
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleManualSubmit} className="space-y-4 pt-4">
            <Input 
              placeholder="Wallet ID"
              value={manualWalletId}
              onChange={(e) => setManualWalletId(e.target.value)}
              required
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowManualEntry(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
