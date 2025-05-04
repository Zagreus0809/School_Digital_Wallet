import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Result } from "@zxing/library";

interface QrScannerProps {
  onScan: (data: string) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

export default function QrScanner({ onScan, onError, onClose }: QrScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader>(new BrowserMultiFormatReader());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Request camera permission
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(() => setHasPermission(true))
      .catch((error) => {
        setHasPermission(false);
        onError(error);
      });
    
    // Clean up the camera stream when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // The reader should automatically be garbage collected when no longer used
      // No explicit cleanup needed for BrowserMultiFormatReader
      // Stop the camera
      navigator.mediaDevices.getUserMedia({ video: false })
        .then((stream) => {
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(() => {});
    };
  }, [onError]);

  useEffect(() => {
    if (hasPermission && webcamRef.current?.video) {
      const scanQrCode = async () => {
        try {
          if (webcamRef.current?.video) {
            const result: Result = await codeReaderRef.current.decodeOnceFromVideoElement(webcamRef.current.video);
            // Vibrate on successful scan if supported
            if (navigator.vibrate) {
              navigator.vibrate(100);
            }
            onScan(result.getText());
          }
        } catch (error) {
          // If it's just a normal exception (no QR code found), retry
          if (error instanceof Error && error.message.includes("not found")) {
            timeoutRef.current = setTimeout(scanQrCode, 500);
          } else {
            console.error(error);
          }
        }
      };
      
      scanQrCode();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasPermission, webcamRef.current?.video]);

  if (hasPermission === null) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4">Requesting camera permission...</p>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive font-medium mb-2">Camera permission denied</p>
        <p className="text-muted-foreground mb-4">Please enable camera access to scan QR codes</p>
        <button 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          onClick={onClose}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="relative rounded-lg overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={{
            facingMode: "environment"
          }}
          style={{
            width: '100%',
            height: 300,
            objectFit: 'cover',
            borderRadius: '0.5rem'
          }}
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-dashed border-primary m-4 pointer-events-none"></div>
      </div>
    </div>
  );
}
