import React, { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import { cn } from '../lib/utils';
import { X, Loader2, AlertCircle } from 'lucide-react';

interface Transaction {
  id: number | string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  currency: string;
  method: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'SUCCESS';
  submittedAt: number;
}

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  socket?: any;
  userEmail?: string;
}

export default function TransactionHistory({ isOpen, onClose, currencySymbol, socket, userEmail }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!socket || !isOpen || !userEmail) return;

    const handleDeposits = (data: any[]) => {
      const userDeposits = data.filter(d => d.email === userEmail).map(d => ({ ...d, type: 'DEPOSIT' }));
      setTransactions(prev => {
        const other = prev.filter(t => t.type !== 'DEPOSIT');
        return [...other, ...userDeposits].sort((a, b) => b.submittedAt - a.submittedAt);
      });
      setIsLoading(false);
    };

    const handleWithdrawals = (data: any[]) => {
      const userWithdrawals = data.filter(w => w.email === userEmail).map(w => ({ ...w, type: 'WITHDRAW' }));
      setTransactions(prev => {
        const other = prev.filter(t => t.type !== 'WITHDRAW');
        return [...other, ...userWithdrawals].sort((a, b) => b.submittedAt - a.submittedAt);
      });
      setIsLoading(false);
    };

    socket.on('admin-deposits', handleDeposits);
    socket.on('admin-withdrawals', handleWithdrawals);

    // Request initial data
    socket.emit('admin-join', userEmail); // This is a hack to get the initial data if the server allows it, but better to have a specific event

    return () => {
      socket.off('admin-deposits', handleDeposits);
      socket.off('admin-withdrawals', handleWithdrawals);
    };
  }, [socket, isOpen, userEmail]);

  const handleCancel = (id: number | string) => {
    if (socket && userEmail) {
      socket.emit('cancel-withdrawal', { id, email: userEmail });
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} className="bg-[var(--bg-primary)]">
      <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
        <h2 className="text-xl font-bold text-[var(--text-primary)] text-center">Transaction History</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-green-500" size={32} />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <AlertCircle className="mx-auto text-[var(--text-secondary)] opacity-20" size={48} />
            <p className="text-[var(--text-secondary)]">No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map(tx => (
              <div key={`${tx.type}-${tx.id}`} className="bg-[var(--bg-secondary)] p-4 rounded-xl flex justify-between items-center border border-[var(--border-color)] shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[var(--text-primary)]">{tx.type}</p>
                    <span className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded uppercase font-bold">{tx.method}</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                    {new Date(tx.submittedAt).toLocaleDateString()} {new Date(tx.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className={cn("font-bold text-sm", tx.type === 'DEPOSIT' ? "text-[#22c55e]" : "text-[#ff4757]")}>
                    {tx.type === 'DEPOSIT' ? '+' : '-'}{currencySymbol}{tx.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                      tx.status === 'APPROVED' || tx.status === 'SUCCESS' ? "bg-green-500/10 text-green-500" :
                      tx.status === 'PENDING' ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-red-500/10 text-red-500"
                    )}>
                      {tx.status}
                    </span>
                    {tx.type === 'WITHDRAW' && tx.status === 'PENDING' && (
                      <button 
                        onClick={() => handleCancel(tx.id)}
                        className="text-[10px] font-bold text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
