import React, { useState, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import { cn } from '../lib/utils';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface WithdrawFlowProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  currencyCode: string;
  socket: any;
  userEmail: string;
  balance: number;
  activeAccount: string;
}

export default function WithdrawFlow({ isOpen, onClose, currencySymbol, currencyCode, socket, userEmail, balance, activeAccount }: WithdrawFlowProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!socket) return;
    
    const handleSuccess = () => setStatus('SUCCESS');
    const handleError = (msg: string) => {
      setStatus('ERROR');
      setErrorMsg(msg);
    };

    socket.on('withdraw-submitted', handleSuccess);
    socket.on('withdraw-error', handleError);

    return () => {
      socket.off('withdraw-submitted', handleSuccess);
      socket.off('withdraw-error', handleError);
    };
  }, [socket]);

  const handleSubmit = () => {
    if (activeAccount === 'DEMO') {
      setStatus('ERROR');
      setErrorMsg('You can only withdraw from your Real Account balance.');
      return;
    }
    if (!amount || amount < 10 || !method || !accountDetails || !socket || !userEmail) return;
    if (amount > balance) {
      setStatus('ERROR');
      setErrorMsg('Insufficient balance for this withdrawal.');
      return;
    }
    
    setStatus('SUBMITTING');
    socket.emit('submit-withdraw', {
      email: userEmail,
      amount: Number(amount),
      currency: currencyCode,
      method,
      accountDetails
    });
  };

  const resetAndClose = () => {
    setAmount('');
    setMethod('');
    setAccountDetails('');
    setStatus('IDLE');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={resetAndClose} className="bg-[var(--bg-primary)]">
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-[var(--text-primary)] text-center">Withdraw Funds</h2>
        
        {status === 'SUCCESS' ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">Request Submitted</h3>
            <p className="text-[var(--text-secondary)]">Your withdrawal request is being processed.</p>
            <button 
              onClick={resetAndClose}
              className="w-full bg-[#22c55e] text-black font-bold py-4 rounded-xl mt-4"
            >
              Done
            </button>
          </div>
        ) : status === 'ERROR' ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
              <XCircle size={40} />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">Submission Failed</h3>
            <p className="text-[var(--text-secondary)]">{errorMsg}</p>
            <button 
              onClick={() => setStatus('IDLE')}
              className="w-full bg-[#22c55e] text-black font-bold py-4 rounded-xl mt-4"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-[var(--text-secondary)]">Amount ({currencyCode})</label>
                <span className="text-xs text-[var(--text-secondary)]">Available: {currencySymbol}{balance.toFixed(2)}</span>
              </div>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setAmount('');
                  } else {
                    const num = Number(val);
                    if (!isNaN(num)) {
                      setAmount(num);
                    }
                  }
                }}
                className="w-full bg-[var(--bg-secondary)] p-4 rounded-xl text-[var(--text-primary)] font-bold text-lg"
                placeholder={`Min. ${currencySymbol}10`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[var(--text-secondary)]">Withdrawal Method</label>
              <div className="grid grid-cols-2 gap-2">
                {['bKash', 'Nagad', 'Rocket', 'USDT'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMethod(m)}
                    className={cn(
                      "p-4 rounded-xl border font-bold",
                      method === m ? "bg-[#22c55e] border-[#22c55e] text-white" : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)]"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {method && (
              <div className="space-y-2">
                <label className="text-sm text-[var(--text-secondary)]">Account Details</label>
                <input 
                  type="text" 
                  value={accountDetails} 
                  onChange={(e) => setAccountDetails(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] p-4 rounded-xl text-[var(--text-primary)] text-sm"
                  placeholder={method === 'USDT' ? "Enter TRC20 Address" : `Enter ${method} Number`}
                />
              </div>
            )}

            <button 
              disabled={!amount || amount < 10 || !method || !accountDetails || status === 'SUBMITTING'}
              onClick={handleSubmit}
              className="w-full bg-[#22c55e] text-black font-bold py-4 rounded-xl disabled:opacity-50 flex justify-center items-center"
            >
              {status === 'SUBMITTING' ? <Loader2 className="animate-spin" size={24} /> : 'Request Withdrawal'}
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
