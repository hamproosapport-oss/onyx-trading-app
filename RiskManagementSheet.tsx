import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, AlertTriangle, CheckCircle2, Save } from 'lucide-react';
import { cn } from '../lib/utils';

interface RiskManagementSheetProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  currencySymbol: string;
}

export default function RiskManagementSheet({ isOpen, onClose, balance, currencySymbol }: RiskManagementSheetProps) {
  const [dailyStopLoss, setDailyStopLoss] = useState<number>(0);
  const [dailyTakeProfit, setDailyTakeProfit] = useState<number>(0);
  const [maxTradeAmount, setMaxTradeAmount] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load from local storage or just keep local state
    const saved = localStorage.getItem('risk_management');
    if (saved) {
      const data = JSON.parse(saved);
      setDailyStopLoss(data.dailyStopLoss || 0);
      setDailyTakeProfit(data.dailyTakeProfit || 0);
      setMaxTradeAmount(data.maxTradeAmount || 0);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('risk_management', JSON.stringify({
      dailyStopLoss,
      dailyTakeProfit,
      maxTradeAmount
    }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 pointer-events-auto"
          onClick={onClose}
        />
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full bg-[#1e222d] rounded-t-2xl pointer-events-auto flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <Shield className="text-[#3b82f6]" size={20} />
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Risk Management</h2>
            </div>
            <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition p-1 rounded-full hover:bg-[var(--text-primary)]/10">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1 space-y-6">
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)]">
              <div className="flex items-start gap-3 mb-2">
                <AlertTriangle className="text-[#ff9f43] shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Protect your capital by setting daily limits. Trading will be restricted if these limits are reached.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Daily Stop Loss */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">
                  <span>Daily Stop Loss</span>
                  <span className="text-[var(--text-primary)]">{currencySymbol}{dailyStopLoss}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">{currencySymbol}</span>
                  <input 
                    type="number" 
                    value={dailyStopLoss || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setDailyStopLoss(0);
                      } else {
                        const num = Number(val);
                        if (!isNaN(num)) {
                          setDailyStopLoss(num);
                        }
                      }
                    }}
                    placeholder="0.00"
                    className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] pl-8 pr-4 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-[#3b82f6] transition"
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Maximum amount you are willing to lose in a day.</p>
              </div>

              {/* Daily Take Profit */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">
                  <span>Daily Take Profit</span>
                  <span className="text-[var(--text-primary)]">{currencySymbol}{dailyTakeProfit}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">{currencySymbol}</span>
                  <input 
                    type="number" 
                    value={dailyTakeProfit || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setDailyTakeProfit(0);
                      } else {
                        const num = Number(val);
                        if (!isNaN(num)) {
                          setDailyTakeProfit(num);
                        }
                      }
                    }}
                    placeholder="0.00"
                    className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] pl-8 pr-4 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-[#22c55e] transition"
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Target profit to stop trading for the day.</p>
              </div>

              {/* Max Trade Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)] flex justify-between">
                  <span>Max Trade Amount</span>
                  <span className="text-[var(--text-primary)]">{currencySymbol}{maxTradeAmount}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">{currencySymbol}</span>
                  <input 
                    type="number" 
                    value={maxTradeAmount || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setMaxTradeAmount(0);
                      } else {
                        const num = Number(val);
                        if (!isNaN(num)) {
                          setMaxTradeAmount(num);
                        }
                      }
                    }}
                    placeholder="0.00"
                    className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] pl-8 pr-4 py-3 rounded-xl border border-[var(--border-color)] focus:outline-none focus:border-[#3b82f6] transition"
                  />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">Maximum amount allowed per single trade.</p>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className={cn(
                "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition",
                isSaved ? "bg-[#22c55e] text-[#0a2e16]" : "bg-[#3b82f6] text-white hover:bg-[#2563eb]"
              )}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={18} />
                  Saved Successfully
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
