import React from 'react';
import { Activity, BarChart2, CandlestickChart, LineChart } from 'lucide-react';
import BottomSheet from './BottomSheet';
import { cn } from '../lib/utils';

interface ChartSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimeFrame: string;
  onTimeFrameChange: (tf: string) => void;
  currentChartType: string;
  onChartTypeChange: (type: string) => void;
}

const TIME_FRAMES = [
  '5s', '10s', '15s', '30s', '1m', '2m', '5m', '10m', '15m', '30m', '1h', '4h', '1d'
];

const CHART_TYPES = [
  { id: 'Area', icon: Activity, label: 'Area' },
  { id: 'Candlestick', icon: CandlestickChart, label: 'Candlestick' },
  { id: 'Heikin Ashi', icon: BarChart2, label: 'Heikin Ashi' },
  { id: 'Bar', icon: BarChart2, label: 'Bar' },
];

export default function ChartSettingsSheet({ 
  isOpen, 
  onClose, 
  currentTimeFrame, 
  onTimeFrameChange,
  currentChartType,
  onChartTypeChange
}: ChartSettingsSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="pb-8 pt-2">
        {/* Time Frame Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-4 mb-3">
            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Candle Time Frame</h3>
            <div className="w-4 h-4 rounded-full border border-[var(--text-secondary)] flex items-center justify-center text-[10px] text-[var(--text-secondary)]">?</div>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide px-4">
            <div className="flex items-center gap-2 w-max">
              {TIME_FRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => onTimeFrameChange(tf)}
                  className={cn(
                    "min-w-[50px] h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all active:scale-95",
                    currentTimeFrame === tf 
                      ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]" 
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Type Section */}
        <div>
          <h3 className="px-4 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Chart Type</h3>
          
          <div className="overflow-x-auto scrollbar-hide px-4">
            <div className="flex items-center gap-3 w-max">
              {CHART_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => onChartTypeChange(type.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all active:scale-95",
                    currentChartType === type.id
                      ? "bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-primary)]"
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <type.icon size={20} />
                  <span className="text-sm font-bold whitespace-nowrap">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
