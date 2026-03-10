import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface AddAccountSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (currency: string, name: string) => void;
}

const CURRENCIES = [
  { code: 'BDT', name: 'Bangladeshi taka', symbol: '৳', flag: '🇧🇩' },
  { code: 'USD', name: 'US dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'USDT', name: 'USDT', symbol: '₮', flag: '₮' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
];

export default function AddAccountSheet({ isOpen, onClose, onAddAccount }: AddAccountSheetProps) {
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [accountName, setAccountName] = useState(`${CURRENCIES[0].code} Account`);

  const handleNext = () => {
    setAccountName(`${selectedCurrency.code} Account`);
    setStep(2);
  };

  const handleCreate = () => {
    onAddAccount(selectedCurrency.code, accountName);
    onClose();
    setStep(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-[var(--bg-primary)] rounded-t-[20px] h-[90vh] flex flex-col"
          >
            <div className="flex items-center p-4 border-b border-[var(--border-color)]">
              <button onClick={step === 2 ? () => setStep(1) : onClose} className="p-2">
                <ChevronLeft size={24} className="text-[var(--text-primary)]" />
              </button>
              <h2 className="text-[var(--text-primary)] font-bold text-lg flex-1 text-center mr-10">
                {step === 1 ? 'Add Account' : 'Account name'}
              </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {step === 1 ? (
                <>
                  <p className="text-[var(--text-secondary)] mb-6">Select the currency for the trading account from the available list.</p>
                  <div className="space-y-2">
                    {CURRENCIES.map((currency) => (
                      <div
                        key={currency.code}
                        onClick={() => setSelectedCurrency(currency)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border transition cursor-pointer",
                          selectedCurrency.code === currency.code 
                            ? "border-[#22c55e] bg-[#22c55e]/10" 
                            : "border-[var(--border-color)] bg-[var(--bg-secondary)]"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{currency.flag}</span>
                          <div>
                            <div className="text-[var(--text-primary)] font-bold">{currency.code} — {currency.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[var(--text-secondary)] font-bold">{currency.code}</span>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            selectedCurrency.code === currency.code ? "border-[#22c55e] bg-[#22c55e]" : "border-[var(--text-secondary)]"
                          )}>
                            {selectedCurrency.code === currency.code && <Check size={12} className="text-black" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[var(--text-secondary)] mb-6">You can customize your account name if you want.</p>
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)]">
                    <label className="text-[var(--text-secondary)] text-xs mb-1 block">Account name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full bg-transparent text-[var(--text-primary)] font-bold text-lg focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-[var(--border-color)]">
              <button
                onClick={step === 1 ? handleNext : handleCreate}
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold py-4 rounded-xl transition active:scale-[0.98]"
              >
                {step === 1 ? 'Next' : 'Create Account'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
