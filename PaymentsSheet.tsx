import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeftRight, 
  History, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  Smartphone,
  Bitcoin
} from 'lucide-react';
import BottomSheet from './BottomSheet';
import DepositFlow from './DepositFlow';
import WithdrawFlow from './WithdrawFlow';
import TransferFlow from './TransferFlow';
import TransactionHistory from './TransactionHistory';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface PaymentsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  rawBalance?: number;
  userId?: string;
  activeAccount: string;
  currencySymbol: string;
  currencyCode: string;
  initialPromoCode?: string | null;
  socket?: any;
  userEmail?: string;
}

const RECENT_TRANSACTIONS = [
  { id: 1, type: 'DEPOSIT', method: 'bKash', amount: 3600, date: 'Mar 1, 2026', status: 'SUCCESS' },
  { id: 2, type: 'WITHDRAW', method: 'Nagad', amount: 1200, date: 'Feb 28, 2026', status: 'PENDING' },
  { id: 3, type: 'DEPOSIT', method: 'BinancePay', amount: 12000, date: 'Feb 25, 2026', status: 'SUCCESS' },
];

export default function PaymentsSheet({ isOpen, onClose, balance, rawBalance, userId, activeAccount, currencySymbol, currencyCode, initialPromoCode, socket, userEmail }: PaymentsSheetProps) {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    if (initialPromoCode && !isDepositOpen) {
      setIsDepositOpen(true);
    }
  }, [initialPromoCode, isDepositOpen]);

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        <div className="px-4 pb-8 space-y-6">
          <div className="flex items-center justify-center py-2 border-b border-[var(--border-color)] -mx-4 mb-4">
            <h2 className="text-[var(--text-primary)] font-bold text-lg pb-2">Payments</h2>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => setIsDepositOpen(true)}
              className="w-full bg-[#34ff34] hover:bg-[#2ce62c] active:scale-[0.98] transition-all rounded-2xl py-4 px-6 flex items-center gap-4 text-black font-bold text-lg shadow-lg shadow-green-500/20"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Wallet size={24} strokeWidth={2.5} />
              </div>
              <span className="flex-1 text-center mr-10">Deposit</span>
            </button>
            
            <button 
              onClick={() => setIsWithdrawOpen(true)}
              className="w-full bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] active:scale-[0.98] transition-all rounded-2xl py-4 px-6 flex items-center gap-4 text-[var(--text-primary)] font-bold text-lg border border-[var(--border-color)] shadow-sm"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <ArrowDown size={24} />
              </div>
              <span className="flex-1 text-center mr-10">Withdraw</span>
            </button>

            <button 
              onClick={() => setIsTransferOpen(true)}
              className="w-full bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] active:scale-[0.98] transition-all rounded-2xl py-4 px-6 flex items-center gap-4 text-[var(--text-primary)] font-bold text-lg border border-[var(--border-color)] shadow-sm"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <ArrowLeftRight size={24} />
              </div>
              <span className="flex-1 text-center mr-10">Internal Transfer</span>
            </button>

            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="w-full bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)] active:scale-[0.98] transition-all rounded-2xl py-4 px-6 flex items-center gap-4 text-[var(--text-primary)] font-bold text-lg border border-[var(--border-color)] shadow-sm"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <History size={24} />
              </div>
              <span className="flex-1 text-center mr-10">Transactions</span>
            </button>
          </div>
        </div>
      </BottomSheet>

      <AnimatePresence>
        {isDepositOpen && (
          <DepositFlow 
            isOpen={isDepositOpen} 
            onClose={() => setIsDepositOpen(false)} 
            currencySymbol={currencySymbol}
            currencyCode={currencyCode}
            initialPromoCode={initialPromoCode}
            socket={socket}
            userEmail={userEmail}
            rawBalance={rawBalance}
            userId={userId}
          />
        )}
        {isWithdrawOpen && (
          <WithdrawFlow 
            isOpen={isWithdrawOpen} 
            onClose={() => setIsWithdrawOpen(false)} 
            currencySymbol={currencySymbol}
            currencyCode={currencyCode}
            socket={socket}
            userEmail={userEmail}
            balance={balance}
            activeAccount={activeAccount}
          />
        )}
        {isTransferOpen && (
          <TransferFlow 
            isOpen={isTransferOpen} 
            onClose={() => setIsTransferOpen(false)} 
            currencySymbol={currencySymbol}
          />
        )}
        {isHistoryOpen && (
          <TransactionHistory 
            isOpen={isHistoryOpen} 
            onClose={() => setIsHistoryOpen(false)} 
            currencySymbol={currencySymbol}
            socket={socket}
            userEmail={userEmail}
          />
        )}
      </AnimatePresence>
    </>
  );
}
