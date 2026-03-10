import React, { useState } from 'react';
import { Search, TrendingUp, BarChart2, Activity, Zap, ChevronRight } from 'lucide-react';
import BottomSheet from './BottomSheet';
import { cn } from '../lib/utils';

interface IndicatorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIndicator: (indicator: string) => void;
}

const INDICATORS = [
  { category: 'Trend', icon: TrendingUp, items: [
    { id: 'SMA', name: 'SMA' },
    { id: 'EMA', name: 'EMA' },
    { id: 'ParabolicSAR', name: 'Parabolic' },
    { id: 'Ichimoku', name: 'Ichimoku Cloud' },
    { id: 'Alligator', name: 'Alligator' },
    { id: 'ZigZag', name: 'ZigZag' },
    { id: 'WMA', name: 'WMA' },
    { id: 'DonchianChannel', name: 'Donchian Channel' },
  ]},
  { category: 'Oscillators', icon: Activity, items: [
    { id: 'MACD', name: 'MACD' },
    { id: 'RSI', name: 'RSI' },
    { id: 'Stochastic', name: 'Stochastic Oscillator' },
    { id: 'DeMarker', name: 'DeMarker' },
    { id: 'Aroon', name: 'Aroon' },
    { id: 'BearsPower', name: 'BearsPower' },
    { id: 'BullsPower', name: 'BullsPower' },
    { id: 'CCI', name: 'CCI' },
    { id: 'RateOfChange', name: 'Rate of change' },
  ]},
  { category: 'Volatility', icon: Zap, items: [
    { id: 'BollingerBands', name: 'Bollinger Bands' },
  ]},
  { category: 'Volume', icon: BarChart2, items: [
    { id: 'Volume', name: 'Volume' },
  ]},
];

export default function IndicatorSheet({ isOpen, onClose, onSelectIndicator }: IndicatorSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIndicators = INDICATORS.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="pb-8 pt-2">
        <div className="px-4 mb-6">
          <h2 className="text-[var(--text-primary)] font-bold text-xl mb-4">Indicators</h2>
          <div className="bg-[var(--bg-secondary)] rounded-xl flex items-center gap-3 border border-[var(--border-color)] p-3.5 focus-within:border-[#3b82f6] transition">
            <Search size={20} className="text-[var(--text-secondary)]" />
            <input 
              type="text"
              placeholder="Search indicators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[var(--text-primary)] text-sm focus:outline-none w-full placeholder:text-[var(--text-secondary)]/50"
            />
          </div>
        </div>
        
        <div className="px-4 space-y-6">
          {filteredIndicators.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.category}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={16} className="text-[#3b82f6]" />
                  <h4 className="font-bold text-[var(--text-primary)] text-sm">{group.category}</h4>
                </div>
                <div className="space-y-1">
                  {group.items.map((indicator) => (
                    <button
                      key={indicator.id}
                      onClick={() => {
                        onSelectIndicator(indicator.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] transition group"
                    >
                      <span className="text-sm font-medium text-[var(--text-primary)]">{indicator.name}</span>
                      <ChevronRight size={16} className="text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
}
