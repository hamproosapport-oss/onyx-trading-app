import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, MoreVertical, Check, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import AddAccountSheet from './AddAccountSheet';

interface Account {
  id: string;
  name: string;
  currency: string;
  balance: number;
  type: 'DEMO' | 'REAL';
  flag: string;
}

interface AccountsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeAccount: string;
  onSelectAccount: (id: string) => void;
  onRefill: () => void;
  accounts: Account[];
  onAddAccount: (account: Account) => void;
  onDeleteAccount: (id: string) => void;
}

export default function AccountsSheet({ 
  isOpen, 
  onClose, 
  activeAccount,
  onSelectAccount,
  onRefill,
  accounts,
  onAddAccount,
  onDeleteAccount
}: AccountsSheetProps) {
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [showDelete, setShowDelete] = useState<string | null>(null);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-primary)] rounded-t-[20px] overflow-hidden border-t border-[var(--border-color)] pb-safe"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[var(--text-secondary)]/30 rounded-full" />
              </div>

              <div className="px-4 pb-4 text-center relative">
                <h2 className="text-[var(--text-primary)] font-bold text-lg">Accounts</h2>
              </div>

              <div className="px-4 pb-8 space-y-3">
                {accounts.map((account) => (
                  <div 
                    key={account.id}
                    onClick={() => {
                      onSelectAccount(account.id);
                      onClose();
                    }}
                    className={cn(
                      "bg-[var(--bg-secondary)] rounded-xl p-4 flex items-center justify-between border transition active:scale-[0.98]",
                      activeAccount === account.id ? "border-[#22c55e]/50" : "border-[var(--border-color)] hover:bg-[var(--bg-tertiary)]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-xl">
                        {account.flag}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[var(--text-primary)] font-medium text-sm">{account.name}</span>
                        <span className="text-[var(--text-secondary)] text-sm">
                          {account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeAccount === account.id && (
                        <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center">
                          <Check size={12} className="text-black" strokeWidth={3} />
                        </div>
                      )}
                      {account.type === 'DEMO' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onRefill(); }}
                          className="p-2 hover:bg-[var(--text-primary)]/10 rounded-full text-[#ff9f43]"
                        >
                          <RefreshCw size={18} />
                        </button>
                      )}
                      {account.type === 'REAL' && account.balance === 0 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowDelete(account.id); }}
                          className={cn("p-2 rounded-full transition", showDelete === account.id ? "bg-red-500 text-white" : "text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500")}
                        >
                          {showDelete === account.id ? <Check size={18} onClick={(e) => { e.stopPropagation(); onDeleteAccount(account.id); setShowDelete(null); }} /> : <Trash2 size={18} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => setIsAddAccountOpen(true)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-[var(--text-primary)]/5 transition text-[var(--text-primary)] font-medium mt-2 border border-dashed border-[var(--border-color)]"
                >
                  <Plus size={24} />
                  <span>Add Account</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AddAccountSheet 
        isOpen={isAddAccountOpen} 
        onClose={() => setIsAddAccountOpen(false)} 
        onAddAccount={(currency, name) => {
          onAddAccount({
            id: Math.random().toString(36).substr(2, 9),
            name,
            currency,
            balance: 0,
            type: 'REAL',
            flag: '💰'
          });
        }}
      />
    </>
  );
}
