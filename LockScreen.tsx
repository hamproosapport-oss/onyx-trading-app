import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete, ShieldCheck, Fingerprint } from 'lucide-react';
import { cn } from '../lib/utils';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const correctPin = localStorage.getItem('app-pin') || '';

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onUnlock();
        } else {
          setError(true);
          setAttempts(prev => prev + 1);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--bg-primary)] flex flex-col items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xs flex flex-col items-center gap-8"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/5">
            <Lock size={40} strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-[var(--text-primary)]">App Locked</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">Enter your 4-digit PIN to unlock</p>
          </div>
        </div>

        {/* PIN Indicators */}
        <div className={cn(
          "flex gap-6 transition-transform",
          error && "animate-shake"
        )}>
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className={cn(
                "w-4 h-4 rounded-full border-2 transition-all duration-300",
                pin.length > i 
                  ? "bg-blue-500 border-blue-500 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                  : "border-[var(--border-color)] bg-transparent"
              )}
            />
          ))}
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs font-bold uppercase tracking-widest"
          >
            Incorrect PIN. Try again.
          </motion.p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-20 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-2xl font-black text-[var(--text-primary)] transition active:scale-90 flex items-center justify-center shadow-lg"
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center">
            <Fingerprint size={32} className="text-[var(--text-secondary)] opacity-20" />
          </div>
          <button
            onClick={() => handleKeyPress("0")}
            className="h-20 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-2xl font-black text-[var(--text-primary)] transition active:scale-90 flex items-center justify-center shadow-lg"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-20 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] transition active:scale-90 flex items-center justify-center shadow-lg"
          >
            <Delete size={28} />
          </button>
        </div>

        <div className="mt-4">
          <button 
            onClick={() => {
              // In a real app, this would trigger a reset flow
              alert("Please contact support to reset your PIN.");
            }}
            className="text-xs font-bold text-blue-500 hover:underline uppercase tracking-widest"
          >
            Forgot PIN?
          </button>
        </div>
      </motion.div>
    </div>
  );
};
