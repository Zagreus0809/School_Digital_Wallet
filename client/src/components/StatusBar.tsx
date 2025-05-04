import { useAuth } from "@/hooks/use-auth";

interface StatusBarProps {
  isConnected: boolean;
}

export default function StatusBar({ isConnected }: StatusBarProps) {
  return (
    <div className="bg-primary text-primary-foreground flex justify-between items-center px-4 py-3 fixed top-0 left-0 right-0 z-50">
      <div className="font-semibold">School Digital Wallet</div>
      <div className="flex items-center space-x-2">
        <span className={`text-xs ${isConnected ? 'bg-white/20' : 'bg-destructive/80'} rounded-full px-2 py-0.5`}>
          {isConnected ? 'Connected' : 'Offline'}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      </div>
    </div>
  );
}
