import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@shared/schema";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface SuccessModalProps {
  show: boolean;
  transaction: any;
  onClose: () => void;
  onViewReceipt: () => void;
}

export default function SuccessModal({ 
  show, 
  transaction, 
  onClose, 
  onViewReceipt 
}: SuccessModalProps) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          
          <DialogTitle className="text-xl mb-1">Payment Successful!</DialogTitle>
          <DialogDescription className="mb-4">
            Your payment has been sent successfully
          </DialogDescription>
          
          <div className="w-full p-4 bg-muted rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">₱{transaction?.amount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">To</span>
              <span className="font-medium">{transaction?.receiverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-medium text-xs">{transaction?.transactionId}</span>
            </div>
          </div>
          
          <div className="flex flex-col w-full space-y-2">
            <Button onClick={onClose}>
              Back to Home
            </Button>
            <Button variant="outline" onClick={onViewReceipt}>
              View Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
