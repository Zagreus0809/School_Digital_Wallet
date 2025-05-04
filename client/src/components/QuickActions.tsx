interface QuickActionsProps {
  onHistory: () => void;
  onFriends: () => void;
}

export default function QuickActions({ onHistory, onFriends }: QuickActionsProps) {
  return (
    <div className="mt-8 mb-6">
      <h3 className="text-md font-medium mb-3">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-3 cursor-pointer" onClick={onHistory}>
          <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <span className="text-xs">History</span>
        </div>
        
        <div className="p-3 cursor-pointer">
          <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
              <path d="m2 9 3-3 3 3" />
              <path d="M13 18H7a2 2 0 0 1-2-2V6" />
              <path d="m22 15-3 3-3-3" />
              <path d="M11 6h6a2 2 0 0 1 2 2v10" />
            </svg>
          </div>
          <span className="text-xs">Deposit</span>
        </div>
        
        <div className="p-3 cursor-pointer" onClick={onFriends}>
          <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="text-xs">Friends</span>
        </div>
        
        <div className="p-3 cursor-pointer">
          <div className="bg-secondary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 18V6" />
            </svg>
          </div>
          <span className="text-xs">Payments</span>
        </div>
      </div>
    </div>
  );
}
