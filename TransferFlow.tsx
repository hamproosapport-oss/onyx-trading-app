import React, { useState } from 'react';
import BottomSheet from './BottomSheet';

interface TransferFlowProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
}

export default function TransferFlow({ isOpen, onClose, currencySymbol }: TransferFlowProps) {
  const [amount, setAmount] = useState<number>(0);
  const [recipient, setRecipient] = useState('');

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} className="bg-[var(--bg-primary)]">
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)] text-center">Internal Transfer</h2>
        
        <div className="space-y-2">
          <label className="text-sm text-[var(--text-secondary)]">Recipient Account ID</label>
          <input 
            type="text" 
            value={recipient} 
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] p-4 rounded-xl text-[var(--text-primary)] font-bold text-lg"
            placeholder="Enter Account ID"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[var(--text-secondary)]">Amount</label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-[var(--bg-secondary)] p-4 rounded-xl text-[var(--text-primary)] font-bold text-lg"
            placeholder={`${currencySymbol}0.00`}
          />
        </div>

        <button 
          disabled={amount <= 0 || !recipient}
          className="w-full bg-[#22c55e] text-black font-bold py-4 rounded-xl disabled:opacity-50"
        >
          Transfer Funds
        </button>
      </div>
    </BottomSheet>
  );
}
