import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import { cn } from '../lib/utils';

interface TradeInputSheetProps {
  isOpen: boolean;
  onClose: () => void;
  duration: number;
  onDurationChange: (duration: number) => void;
  investment: number;
  onInvestmentChange: (amount: number) => void;
  currentPrice: number;
  currencySymbol: string;
}

type Tab = 'DURATION' | 'AMOUNT' | 'STRIKE_PRICES';
type Mode = 'QUICK' | 'TIMER' | 'CLOCK';

export default function TradeInputSheet({ 
  isOpen, 
  onClose, 
  duration, 
  onDurationChange,
  investment,
  onInvestmentChange,
  currentPrice,
  currencySymbol
}: TradeInputSheetProps) {
  const [activeTab, setActiveTab] = useState<Tab>('DURATION');
  const [mode, setMode] = useState<Mode>('TIMER');
  const [selectedClockTime, setSelectedClockTime] = useState({ h: new Date().getHours(), m: new Date().getMinutes() });

  // Convert duration to hours and minutes for TIMER mode
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  const handleTimerChange = (h: number, m: number) => {
    onDurationChange(h * 3600 + m * 60);
  };

  const handleClockChange = (h: number, m: number) => {
    setSelectedClockTime({ h, m });
    
    const now = new Date();
    const target = new Date();
    target.setHours(h, m, 0, 0);
    
    // If target time is in the past, assume it's for tomorrow
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }
    
    const diffSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);
    onDurationChange(diffSeconds);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} className="bg-[var(--bg-primary)]">
      <div className="flex flex-col h-[550px]">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border-color)] px-4">
          <button 
            onClick={() => setActiveTab('DURATION')}
            className={cn(
              "flex-1 py-4 text-sm font-bold transition-all relative",
              activeTab === 'DURATION' ? "text-[#22c55e]" : "text-[var(--text-secondary)]"
            )}
          >
            Duration
            {activeTab === 'DURATION' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e]" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('AMOUNT')}
            className={cn(
              "flex-1 py-4 text-sm font-bold transition-all relative flex flex-col items-center",
              activeTab === 'AMOUNT' ? "text-[#22c55e]" : "text-[var(--text-secondary)]"
            )}
          >
            <span className="text-[10px] text-[var(--text-secondary)] font-medium mb-0.5">Amount</span>
            <span>{currencySymbol}{investment}</span>
            {activeTab === 'AMOUNT' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e]" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('STRIKE_PRICES')}
            className={cn(
              "flex-1 py-4 text-sm font-bold transition-all relative flex flex-col items-center",
              activeTab === 'STRIKE_PRICES' ? "text-[#22c55e]" : "text-[var(--text-secondary)]"
            )}
          >
            <span className="text-[10px] text-[var(--text-secondary)] font-medium mb-0.5">Strike prices</span>
            <span>{currentPrice.toFixed(5)}</span>
            {activeTab === 'STRIKE_PRICES' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e]" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'DURATION' && (
            <div className="flex flex-col items-center">
              {/* Mode Toggle */}
              <div className="flex bg-[var(--bg-secondary)] rounded-xl p-1 w-full mb-6">
                <button 
                  onClick={() => setMode('QUICK')}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-bold transition",
                    mode === 'QUICK' ? "bg-[#a3ff33] text-black" : "text-[var(--text-secondary)]"
                  )}
                >
                  Quick
                </button>
                <button 
                  onClick={() => setMode('TIMER')}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-bold transition",
                    mode === 'TIMER' ? "bg-[#a3ff33] text-black" : "text-[var(--text-secondary)]"
                  )}
                >
                  Timer
                </button>
                <button 
                  onClick={() => setMode('CLOCK')}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-bold transition",
                    mode === 'CLOCK' ? "bg-[#a3ff33] text-black" : "text-[var(--text-secondary)]"
                  )}
                >
                  Clock
                </button>
              </div>

              <p className="text-[var(--text-secondary)] text-sm mb-8 font-medium">
                {mode === 'CLOCK' ? 'Trade will close at' : 'Trade will close after'}
              </p>

              {/* Dynamic Pickers based on Mode */}
              {mode === 'QUICK' && (
                <div className="w-full flex flex-col items-center gap-2 overflow-y-auto max-h-[350px] scrollbar-hide">
                  {[5, 10, 15, 30, 45, 60, 90, 120, 180, 300, 600, 900, 1800, 3600].map(sec => (
                    <button
                      key={sec}
                      onClick={() => {
                        onDurationChange(sec);
                        onClose();
                      }}
                      className={cn(
                        "w-full py-4 rounded-xl font-bold text-xl transition",
                        duration === sec ? "bg-[var(--text-primary)]/10 text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      )}
                    >
                      {sec < 60 ? `${sec} sec` : sec < 3600 ? `${sec / 60} min` : `${sec / 3600} h`}
                    </button>
                  ))}
                </div>
              )}

              {mode === 'TIMER' && (
                <div className="w-full flex justify-center gap-12 relative h-[300px] overflow-hidden">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-16 bg-[var(--text-primary)]/5 rounded-xl pointer-events-none" />
                  
                  {/* Hours Column */}
                  <div className="flex flex-col items-center gap-8 py-20 overflow-y-auto scrollbar-hide">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                      <button
                        key={h}
                        onClick={() => handleTimerChange(h, minutes)}
                        className={cn(
                          "text-2xl font-bold transition",
                          hours === h ? "text-[var(--text-primary)] text-4xl" : "text-[var(--text-secondary)] opacity-40"
                        )}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>

                  {/* Minutes Column */}
                  <div className="flex flex-col items-center gap-8 py-20 overflow-y-auto scrollbar-hide">
                    {[1, 2, 3, 4, 5, 10, 15, 30, 45].map(m => (
                      <button
                        key={m}
                        onClick={() => handleTimerChange(hours, m)}
                        className={cn(
                          "text-2xl font-bold transition",
                          minutes === m ? "text-[var(--text-primary)] text-4xl" : "text-[var(--text-secondary)] opacity-40"
                        )}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode === 'CLOCK' && (
                <div className="w-full flex justify-center gap-6 relative h-[300px] overflow-hidden">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-16 bg-[var(--text-primary)]/5 rounded-xl pointer-events-none" />
                  
                  {/* Hours Column */}
                  <div className="flex flex-col items-center gap-8 py-20 overflow-y-auto scrollbar-hide">
                    {Array.from({ length: 24 }).map((_, h) => (
                      <button
                        key={h}
                        onClick={() => handleClockChange(h, selectedClockTime.m)}
                        className={cn(
                          "text-2xl font-bold transition",
                          selectedClockTime.h === h ? "text-[var(--text-primary)] text-4xl" : "text-[var(--text-secondary)] opacity-40"
                        )}
                      >
                        {h.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-8 py-20">
                    <span className="text-[var(--text-primary)] text-4xl font-bold">:</span>
                  </div>

                  {/* Minutes Column */}
                  <div className="flex flex-col items-center gap-8 py-20 overflow-y-auto scrollbar-hide">
                    {Array.from({ length: 60 }).map((_, m) => (
                      <button
                        key={m}
                        onClick={() => handleClockChange(selectedClockTime.h, m)}
                        className={cn(
                          "text-2xl font-bold transition",
                          selectedClockTime.m === m ? "text-[var(--text-primary)] text-4xl" : "text-[var(--text-secondary)] opacity-40"
                        )}
                      >
                        {m.toString().padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'AMOUNT' && (
            <div className="flex flex-col items-center py-8">
              <p className="text-[var(--text-secondary)] mb-4">Select Investment Amount</p>
              <div className="grid grid-cols-3 gap-3 w-full">
                {(currencySymbol === '৳' ? [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000] : [1, 5, 10, 20, 50, 100, 200, 500, 1000]).map(amt => (
                  <button 
                    key={amt}
                    onClick={() => {
                      onInvestmentChange(amt);
                      onClose();
                    }}
                    className={cn(
                      "py-3 rounded-xl font-bold border transition",
                      investment === amt ? "bg-[#22c55e] border-[#22c55e] text-white" : "bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)]"
                    )}
                  >
                    {currencySymbol}{amt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
