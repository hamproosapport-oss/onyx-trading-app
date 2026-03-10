import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { createChart, ColorType, IChartApi, ISeriesApi, Time, CrosshairMode, CandlestickSeries, AreaSeries, BarSeries, LineSeries } from 'lightweight-charts';

interface Trade {
  id: string;
  type: 'UP' | 'DOWN';
  entryPrice: number;
  startTime: number;
  endTime: number;
  amount: number;
  status: 'ACTIVE' | 'WIN' | 'LOSS';
}

interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface TradingChartProps {
  data: OHLCData[];
  trades: Trade[];
  assetName: string;
  currentTime: number;
  chartType: string;
  chartTimeFrame: string;
  isLoading?: boolean;
  timezoneOffset?: number;
  activeIndicators?: string[];
  onVisibleTimeRangeChange?: (range: { from: number; to: number }) => void;
}

const ChartSkeleton = () => (
  <div className="absolute inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-50">
    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

const getTimeFrameInMs = (tf: string): number => {
  const value = parseInt(tf);
  const unit = tf.replace(String(value), '');
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 60000;
  }
};

export const TradingChart: React.FC<TradingChartProps> = ({ 
  data, 
  trades, 
  assetName,
  currentTime,
  chartType,
  chartTimeFrame,
  isLoading,
  timezoneOffset = 0,
  activeIndicators = [],
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const indicatorsRef = useRef<Record<string, ISeriesApi<any>>>({});
  const verticalLineRef = useRef<HTMLDivElement>(null);
  const horizontalLineRef = useRef<HTMLDivElement>(null);
  const priceDotRef = useRef<HTMLDivElement>(null);
  const bubbleGroupRef = useRef<HTMLDivElement>(null);
  const prevAssetRef = useRef<string>(assetName);
  const isInitializedRef = useRef(false);
  const tradesRef = useRef<Trade[]>(trades);
  const dataRef = useRef<OHLCData[]>(data);
  const [tradeCoords, setTradeCoords] = useState<Array<{ id: string; y: number; price: number; type: 'UP' | 'DOWN'; amount: number }>>([]);
  const [latestCoords, setLatestCoords] = useState<{ x: number; y: number; price: number } | null>(null);

  const updateTradeCoords = () => {
    if (!chartRef.current || !seriesRef.current) return;
    
    const series = seriesRef.current;
    const coords = tradesRef.current.map(trade => {
        const y = series.priceToCoordinate(trade.entryPrice);
        return {
            id: trade.id,
            y: y !== null ? y : -100,
            price: trade.entryPrice,
            type: trade.type,
            amount: trade.amount
        };
    });
    
    setTradeCoords(prev => {
      // Deep comparison to avoid unnecessary updates
      if (JSON.stringify(prev) === JSON.stringify(coords)) return prev;
      return coords;
    });
  };

  const updateLatestCoords = () => {
    if (!chartRef.current || !seriesRef.current || dataRef.current.length === 0) return;
    const series = seriesRef.current;
    const lastCandle = dataRef.current[dataRef.current.length - 1];
    const x = chartRef.current.timeScale().timeToCoordinate((lastCandle.time / 1000) as Time);
    const y = series.priceToCoordinate(lastCandle.close);
    
    // Update state for text content only if changed significantly
    setLatestCoords(prev => {
      const newCoords = { x: x || 0, y: y || 0, price: lastCandle.close };
      if (prev && prev.x === newCoords.x && prev.y === newCoords.y && prev.price === newCoords.price) {
        return prev;
      }
      return newCoords;
    });

    // Direct DOM updates for zero-lag positioning
    if (verticalLineRef.current) {
        verticalLineRef.current.style.display = x !== null ? 'block' : 'none';
        if (x !== null) verticalLineRef.current.style.left = `${x}px`;
    }
    if (horizontalLineRef.current) {
        horizontalLineRef.current.style.display = (x !== null && y !== null) ? 'block' : 'none';
        if (y !== null) horizontalLineRef.current.style.top = `${y}px`;
        if (x !== null) horizontalLineRef.current.style.left = `${x}px`;
    }
    if (priceDotRef.current) {
        priceDotRef.current.style.display = (x !== null && y !== null) ? 'block' : 'none';
        if (x !== null && y !== null) {
            priceDotRef.current.style.left = `${x}px`;
            priceDotRef.current.style.top = `${y}px`;
        }
    }
    if (bubbleGroupRef.current) {
        bubbleGroupRef.current.style.display = y !== null ? 'flex' : 'none';
        if (y !== null) bubbleGroupRef.current.style.top = `${y - 10}px`;
    }
  };

  const updateTradeCoordsRef = useRef(updateTradeCoords);
  const updateLatestCoordsRef = useRef(updateLatestCoords);

  useEffect(() => {
    updateTradeCoordsRef.current = updateTradeCoords;
    updateLatestCoordsRef.current = updateLatestCoords;
  });

  // 1. Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const getThemeColors = () => {
      const style = getComputedStyle(document.documentElement);
      const getVar = (name: string) => style.getPropertyValue(name).trim();
      
      return {
        background: getVar('--bg-primary') || getVar('--color-bg-primary') || '#101114',
        text: getVar('--text-primary') || getVar('--color-text-primary') || '#ffffff',
        secondaryText: getVar('--text-secondary') || getVar('--color-text-secondary') || '#9ca3af',
        border: getVar('--border-color') || getVar('--color-border-color') || 'rgba(255, 255, 255, 0.05)',
        tertiary: getVar('--bg-tertiary') || getVar('--color-bg-tertiary') || '#2a2e39',
      };
    };

    const colors = getThemeColors();

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.secondaryText,
      },
      localization: {
        timeFormatter: (time: number) => {
          const date = new Date((time * 1000) + (timezoneOffset * 60 * 60 * 1000));
          return date.toISOString().replace('T', ' ').substring(0, 19);
        },
      },
      grid: {
        vertLines: { color: colors.border },
        horzLines: { color: colors.border },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: colors.border,
        fixLeftEdge: true,
        fixRightEdge: false, // Allow pulling the candle to the middle
        minBarSpacing: 5,
        maxBarSpacing: 50,
        shiftVisibleRangeOnNewBar: true,
        rightOffset: 45,
        tickMarkFormatter: (time: number) => {
          const date = new Date((time * 1000) + (timezoneOffset * 60 * 60 * 1000));
          const hours = date.getUTCHours().toString().padStart(2, '0');
          const minutes = date.getUTCMinutes().toString().padStart(2, '0');
          const seconds = date.getUTCSeconds().toString().padStart(2, '0');
          return `${hours}:${minutes}:${seconds}`;
        },
      },
      rightPriceScale: {
        borderColor: colors.border,
        scaleMargins: {
          top: 0.1, 
          bottom: 0.1, 
        },
        visible: true,
        borderVisible: false,
        textColor: colors.secondaryText,
        autoScale: true,
      },
      crosshair: {
        mode: CrosshairMode.Hidden,
      },
      handleScroll: true,
      handleScale: {
        axisPressedMouseMove: {
            price: false, // Disable manual price scaling to keep the "system" stable
            time: false,  // Disable manual time scaling to prevent distortion
        },
        mouseWheel: true,
        pinch: true,
        axisDoubleClickReset: true,
      },
    });

    const commonOptions = {
      priceLineVisible: false,
      lastValueVisible: false,
      priceFormat: {
        type: 'price' as const,
        precision: 5,
        minMove: 0.00001,
      },
    };

    const getSeries = () => {
      switch (chartType) {
        case 'Area':
          return chart.addSeries(AreaSeries, {
            ...commonOptions,
            lineColor: '#3b82f6',
            topColor: 'rgba(59, 130, 246, 0.4)',
            bottomColor: 'rgba(59, 130, 246, 0.0)',
            lineWidth: 2,
          });
        case 'Bar':
          return chart.addSeries(BarSeries, {
            ...commonOptions,
            upColor: '#0ecb81',
            downColor: '#f6465d',
          });
        case 'Heikin Ashi':
          return chart.addSeries(CandlestickSeries, {
            ...commonOptions,
            upColor: '#0ecb81',
            downColor: '#f6465d',
            borderVisible: true,
            borderUpColor: '#0ecb81',
            borderDownColor: '#f6465d',
            wickUpColor: '#0ecb81',
            wickDownColor: '#f6465d',
          });
        case 'Candlestick':
        default:
          return chart.addSeries(CandlestickSeries, {
            ...commonOptions,
            upColor: '#0ecb81',
            downColor: '#f6465d',
            borderVisible: true,
            borderUpColor: '#0ecb81',
            borderDownColor: '#f6465d',
            wickUpColor: '#0ecb81',
            wickDownColor: '#f6465d',
          });
      }
    };

    const series = getSeries();

    chartRef.current = chart;
    seriesRef.current = series;
    isInitializedRef.current = true;

    // Initial data load
    if (data.length > 0) {
      let prevHA: any = null;
      const formattedData = data.map(d => {
        const base = {
          time: (d.time / 1000) as Time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        };
        
        if (chartType === 'Area') return { time: base.time, value: base.close };
        
        if (chartType === 'Heikin Ashi') {
          const haClose = (base.open + base.high + base.low + base.close) / 4;
          const haOpen = prevHA ? (prevHA.open + prevHA.close) / 2 : (base.open + base.close) / 2;
          const haHigh = Math.max(base.high, haOpen, haClose);
          const haLow = Math.min(base.low, haOpen, haClose);
          const haCandle = { time: base.time, open: haOpen, high: haHigh, low: haLow, close: haClose };
          prevHA = haCandle;
          return haCandle;
        }
        
        return base;
      });
      series.setData(formattedData);
    }

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
      }
    };

    window.addEventListener('resize', handleResize);

    // Update trade coordinates on scroll/zoom
    chart.timeScale().subscribeVisibleLogicalRangeChange(() => {
        updateTradeCoordsRef.current();
        updateLatestCoordsRef.current();
    });

    const observer = new MutationObserver(() => {
        const newColors = getThemeColors();
        chart.applyOptions({
            layout: {
                background: { type: ColorType.Solid, color: newColors.background },
                textColor: newColors.secondaryText,
            },
            grid: {
                vertLines: { color: newColors.border },
                horzLines: { color: newColors.border },
            },
            timeScale: {
                borderColor: newColors.border,
            },
            rightPriceScale: {
                borderColor: newColors.border,
                textColor: newColors.secondaryText,
            }
        });
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      chart.remove();
      isInitializedRef.current = false;
    };
  }, [chartType]); // Recreate chart when type changes

  // Keep refs updated
  useEffect(() => {
    tradesRef.current = trades;
    dataRef.current = data;
  }, [trades, data]);

  // Handle Indicators
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Clear old indicators
    Object.values(indicatorsRef.current).forEach(series => {
      chartRef.current?.removeSeries(series);
    });
    indicatorsRef.current = {};

    const closePrices = data.map(d => d.close);
    
    activeIndicators.forEach(indicator => {
      if (indicator === 'SMA') {
        const smaSeries = chartRef.current!.addSeries(LineSeries, {
          color: '#2962FF',
          lineWidth: 2,
          crosshairMarkerVisible: false,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        
        const period = 14;
        const smaData = data.map((d, i) => {
          if (i < period - 1) return null;
          const sum = closePrices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
          return { time: (d.time / 1000) as Time, value: sum / period };
        }).filter(Boolean) as any[];
        
        smaSeries.setData(smaData);
        indicatorsRef.current['SMA'] = smaSeries;
      } else if (indicator === 'EMA') {
        const emaSeries = chartRef.current!.addSeries(LineSeries, {
          color: '#FF6D00',
          lineWidth: 2,
          crosshairMarkerVisible: false,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        
        const period = 14;
        const k = 2 / (period + 1);
        let ema = closePrices[0];
        const emaData = data.map((d, i) => {
          if (i > 0) ema = (closePrices[i] * k) + (ema * (1 - k));
          return { time: (d.time / 1000) as Time, value: ema };
        });
        
        emaSeries.setData(emaData);
        indicatorsRef.current['EMA'] = emaSeries;
      } else if (indicator === 'BollingerBands') {
        const upperSeries = chartRef.current!.addSeries(LineSeries, { color: 'rgba(41, 98, 255, 0.5)', lineWidth: 1, crosshairMarkerVisible: false, priceLineVisible: false, lastValueVisible: false });
        const lowerSeries = chartRef.current!.addSeries(LineSeries, { color: 'rgba(41, 98, 255, 0.5)', lineWidth: 1, crosshairMarkerVisible: false, priceLineVisible: false, lastValueVisible: false });
        
        const period = 20;
        const multiplier = 2;
        
        const upperData: any[] = [];
        const lowerData: any[] = [];
        
        data.forEach((d, i) => {
          if (i < period - 1) return;
          const slice = closePrices.slice(i - period + 1, i + 1);
          const sma = slice.reduce((a, b) => a + b, 0) / period;
          const variance = slice.reduce((a, b) => a + Math.pow(b - sma, 2), 0) / period;
          const stdDev = Math.sqrt(variance);
          const time = (d.time / 1000) as Time;
          
          upperData.push({ time, value: sma + (stdDev * multiplier) });
          lowerData.push({ time, value: sma - (stdDev * multiplier) });
        });
        
        upperSeries.setData(upperData);
        lowerSeries.setData(lowerData);
        indicatorsRef.current['BBUpper'] = upperSeries;
        indicatorsRef.current['BBLower'] = lowerSeries;
      } else if (indicator === 'WMA') {
        const wmaSeries = chartRef.current!.addSeries(LineSeries, {
          color: '#E91E63',
          lineWidth: 2,
          crosshairMarkerVisible: false,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        
        const period = 14;
        const wmaData = data.map((d, i) => {
          if (i < period - 1) return null;
          let sum = 0;
          let weightSum = 0;
          for (let j = 0; j < period; j++) {
            const weight = period - j;
            sum += closePrices[i - j] * weight;
            weightSum += weight;
          }
          return { time: (d.time / 1000) as Time, value: sum / weightSum };
        }).filter(Boolean) as any[];
        
        wmaSeries.setData(wmaData);
        indicatorsRef.current['WMA'] = wmaSeries;
      } else if (indicator === 'ParabolicSAR') {
        const sarSeries = chartRef.current!.addSeries(LineSeries, {
          color: '#00BCD4',
          lineWidth: 2,
          crosshairMarkerVisible: false,
          priceLineVisible: false,
          lastValueVisible: false,
          lineStyle: 1, // Dotted
        });
        
        // Simplified SAR for visualization
        const period = 5;
        const sarData = data.map((d, i) => {
          if (i < period) return null;
          const minLow = Math.min(...data.slice(i - period, i).map(x => x.low));
          const maxHigh = Math.max(...data.slice(i - period, i).map(x => x.high));
          const value = d.close > data[i - 1].close ? minLow : maxHigh;
          return { time: (d.time / 1000) as Time, value };
        }).filter(Boolean) as any[];
        
        sarSeries.setData(sarData);
        indicatorsRef.current['ParabolicSAR'] = sarSeries;
      }
    });
  }, [data, activeIndicators, chartType]);

  const prevHARef = useRef<any>(null);

  // 2. Update Data
  useEffect(() => {
    if (!seriesRef.current || !isInitializedRef.current) return;

    const series = seriesRef.current;
    
    // Check if asset changed, first load, or data length changed significantly (full reset)
    const currentSeriesData = series.data();
    const assetChanged = prevAssetRef.current !== assetName;
    
    if (data.length === 0) {
      if (assetChanged) {
        series.setData([]);
        prevAssetRef.current = assetName;
      }
      return;
    }

    const shouldFullReset = 
      assetChanged || 
      currentSeriesData.length === 0 ||
      Math.abs(data.length - currentSeriesData.length) > 5; // Increased threshold to avoid reset on small updates

    if (shouldFullReset) {
       if (assetChanged) {
          series.setData([]); // Explicitly clear old asset data
       }
       
       let prevHA: any = null;
       const formattedData = data.map(d => {
         const base = {
           time: (d.time / 1000) as Time,
           open: d.open,
           high: d.high,
           low: d.low,
           close: d.close,
         };
         
         if (chartType === 'Area') {
           return { time: base.time, value: base.close };
         }

         if (chartType === 'Heikin Ashi') {
            const haClose = (base.open + base.high + base.low + base.close) / 4;
            const haOpen = prevHA ? (prevHA.open + prevHA.close) / 2 : (base.open + base.close) / 2;
            const haHigh = Math.max(base.high, haOpen, haClose);
            const haLow = Math.min(base.low, haOpen, haClose);
            const haCandle = { time: base.time, open: haOpen, high: haHigh, low: haLow, close: haClose };
            prevHA = haCandle;
            return haCandle;
         }

         return base;
       });
       series.setData(formattedData);
       prevAssetRef.current = assetName;
       prevHARef.current = prevHA;
       // Fit content on asset change or full reset
       if (assetChanged) {
          setTimeout(() => {
             chartRef.current?.timeScale().fitContent();
          }, 50);
       }
    } else {
       // Update last candle (incremental update)
       const lastCandle = data[data.length - 1];
       if (lastCandle) {
         let updateData: any;
         
         if (chartType === 'Area') {
            updateData = { time: (lastCandle.time / 1000) as Time, value: lastCandle.close };
         } else if (chartType === 'Heikin Ashi') {
            const base = {
                time: (lastCandle.time / 1000) as Time,
                open: lastCandle.open,
                high: lastCandle.high,
                low: lastCandle.low,
                close: lastCandle.close,
            };
            
            // For Heikin Ashi update, we need the previous candle's HA values
            const haClose = (base.open + base.high + base.low + base.close) / 4;
            const haOpen = prevHARef.current ? (prevHARef.current.open + prevHARef.current.close) / 2 : (base.open + base.close) / 2;
            const haHigh = Math.max(base.high, haOpen, haClose);
            const haLow = Math.min(base.low, haOpen, haClose);
            updateData = { time: base.time, open: haOpen, high: haHigh, low: haLow, close: haClose };
            
            // Update prevHARef only if this is a NEW candle (length increased)
            if (data.length > currentSeriesData.length) {
                prevHARef.current = updateData;
            }
         } else {
            updateData = {
               time: (lastCandle.time / 1000) as Time,
               open: lastCandle.open,
               high: lastCandle.high,
               low: lastCandle.low,
               close: lastCandle.close,
             };
         }
         
         try {
            series.update(updateData);
         } catch (e) {
            console.warn("Chart update failed, falling back to setData:", e);
            // Fallback to full setData if update fails for any reason
            const formattedData = data.map(d => ({
                time: (d.time / 1000) as Time,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
            }));
            series.setData(formattedData as any);
         }
       }
    }
    
    // Also update trade coords when price moves
    updateTradeCoordsRef.current();
    updateLatestCoordsRef.current();
  }, [data, assetName, trades, chartType]);

  const tfMs = getTimeFrameInMs(chartTimeFrame);
  const currentTFStart = Math.floor(currentTime / tfMs) * tfMs;
  const nextTFStart = currentTFStart + tfMs;
  const remainingMs = nextTFStart - currentTime;
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  
  const h = Math.floor(remainingSeconds / 3600);
  const m = Math.floor((remainingSeconds % 3600) / 60);
  const s = remainingSeconds % 60;

  let timerString = '';
  if (h > 0) {
    timerString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  } else {
    timerString = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  return (
    <div ref={chartContainerRef} className="w-full h-full relative overflow-hidden bg-[var(--bg-primary)] flex-1 min-h-[300px] touch-none">
        <AnimatePresence>
            {(isLoading || data.length === 0) && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50"
                >
                    <ChartSkeleton />
                </motion.div>
            )}
        </AnimatePresence>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: (isLoading || data.length === 0) ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full absolute inset-0"
        >
            {/* Custom Trade Overlays */}
            <div className="absolute inset-0 pointer-events-none z-20">
            {/* Latest Price UI (from image) */}
            {latestCoords && (
                <>
                    {/* Horizontal Line to Price Scale - Solid Theme Color */}
                    <div 
                        ref={horizontalLineRef}
                        className="absolute left-0 right-0 h-[1px] bg-[var(--text-primary)] pointer-events-none opacity-50 z-20"
                    />
                    
                    {/* Vertical Line at current candle - Thin and Professional */}
                    <div 
                        ref={verticalLineRef}
                        className="absolute top-0 bottom-0 border-l border-dashed border-[var(--text-primary)] opacity-40 pointer-events-none z-20"
                    />
                    
                    {/* Current Price Dot on Candle */}
                    <div 
                        ref={priceDotRef}
                        className="absolute w-2 h-2 bg-[var(--text-primary)] rounded-full -translate-x-1 -translate-y-1 shadow-lg pointer-events-none z-30"
                    />

                    {/* Timer and Price Bubbles */}
                    <div 
                        ref={bubbleGroupRef}
                        className="absolute flex items-center pointer-events-none z-50"
                        style={{ right: 0 }}
                    >
                        {/* Timer Bubble (Dark) */}
                        <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-sm text-[var(--text-primary)] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[var(--border-color)] mr-1 shadow-lg">
                            {timerString}
                        </div>
                        
                        {/* Price Bubble (White/Accent) - Compact Shape */}
                        <div className="bg-[var(--text-primary)]/90 backdrop-blur-md text-[var(--bg-primary)] text-[11px] font-bold px-2 py-0.5 rounded-l shadow-lg min-w-[60px] text-center mr-0">
                            {latestCoords.price < 10 ? latestCoords.price.toFixed(5) : latestCoords.price.toFixed(3)}
                        </div>
                    </div>
                </>
            )}

            {tradeCoords.map(coord => {
                const trade = tradesRef.current.find(t => t.id === coord.id) as any;
                if (!trade || coord.y === -100) return null;
                
                // Calculate X coordinate for the entry point
                const entryX = chartRef.current?.timeScale().timeToCoordinate((trade.startTime / 1000) as Time);
                
                // Calculate time remaining for active trades
                const timeLeft = Math.max(0, Math.ceil((trade.endTime - currentTime) / 1000));
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                return (
                    <div key={coord.id} className="absolute inset-0 pointer-events-none">
                        {/* Entry Point Dot on the actual candle position */}
                        {entryX !== null && entryX > 0 && (
                             <div 
                                className="absolute z-30 flex items-center justify-center"
                                style={{ 
                                    left: entryX,
                                    top: coord.y,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                {/* Dot */}
                                <div className="w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] shadow-[0_0_10px_rgba(0,0,0,0.5)] z-30" 
                                     style={{ backgroundColor: trade.type === 'UP' ? '#0ecb81' : '#f6465d' }} />
                                
                                {/* Dashed line to the right */}
                                <div className="absolute left-1.5 w-20 h-[1px] border-t border-dashed border-white/50 z-10" />
                            </div>
                        )}

                        {/* Trade Label Bubble (Olymp Trade Style) */}
                        <div 
                            className="absolute flex items-center pointer-events-none z-40"
                            style={{ 
                                top: coord.y,
                                left: (entryX || 0) + 80, // Positioned after the dashed line
                                transform: 'translateY(-50%)'
                            }}
                        >
                            {/* Compact Price/Timer Bubble */}
                            <div 
                                className="flex items-center gap-2 px-2 py-1 rounded-lg border shadow-xl backdrop-blur-md"
                                style={{ 
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                }}
                            >
                                <Clock size={12} className="text-[var(--text-secondary)]" />
                                <span className="text-[10px] font-bold">{timeStr}</span>
                                <span className="text-[10px] font-bold border-l border-white/20 pl-2">
                                    {trade.entryPrice.toFixed(5)}
                                </span>
                            </div>
                        </div>

                        {/* Exit Point Dot (if finished) */}
                        {trade.status !== 'ACTIVE' && (
                            <div 
                                className="absolute w-3 h-3 rounded-full border-2 border-[var(--bg-primary)] shadow-lg z-30 flex items-center justify-center"
                                style={{ 
                                    right: 0,
                                    top: coord.y,
                                    backgroundColor: trade.status === 'WIN' ? '#0ecb81' : '#f6465d',
                                    transform: 'translate(50%, -50%)'
                                }}
                            >
                                <div className="w-1 h-1 bg-white rounded-full" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
        </motion.div>
    </div>
  );
};
