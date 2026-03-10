import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';

// Initialize Database
const db = new Database('trading.db');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS market_history (
    symbol TEXT,
    time INTEGER,
    open REAL,
    high REAL,
    low REAL,
    close REAL,
    PRIMARY KEY (symbol, time)
  );
  
  CREATE TABLE IF NOT EXISTS trade_stats (
    date TEXT PRIMARY KEY,
    total_trades INTEGER DEFAULT 0,
    total_volume REAL DEFAULT 0,
    total_user_profit REAL DEFAULT 0,
    total_user_loss REAL DEFAULT 0,
    house_net REAL DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS kyc_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    documentType TEXT,
    documentNumber TEXT,
    fullName TEXT,
    dateOfBirth TEXT,
    frontImage TEXT,
    backImage TEXT,
    status TEXT DEFAULT 'PENDING',
    submittedAt INTEGER,
    updatedAt INTEGER,
    rejectionReason TEXT
  );

  CREATE TABLE IF NOT EXISTS deposits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    amount REAL,
    currency TEXT,
    method TEXT,
    transactionId TEXT,
    status TEXT DEFAULT 'PENDING',
    submittedAt INTEGER,
    updatedAt INTEGER
  );

  CREATE TABLE IF NOT EXISTS withdrawals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    amount REAL,
    currency TEXT,
    method TEXT,
    accountDetails TEXT,
    status TEXT DEFAULT 'PENDING',
    submittedAt INTEGER,
    updatedAt INTEGER
  );

  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    name TEXT,
    photoURL TEXT,
    uid TEXT,
    balance REAL DEFAULT 0,
    demoBalance REAL DEFAULT 10000,
    status TEXT DEFAULT 'ACTIVE',
    kycStatus TEXT DEFAULT 'NONE',
    isBoosted INTEGER DEFAULT 0,
    createdAt INTEGER,
    lastLogin INTEGER
  );
`);

// Add columns if they don't exist (for existing databases)
try { db.prepare('ALTER TABLE users ADD COLUMN name TEXT').run(); } catch(e) {}
try { db.prepare('ALTER TABLE users ADD COLUMN photoURL TEXT').run(); } catch(e) {}
try { db.prepare('ALTER TABLE users ADD COLUMN uid TEXT').run(); } catch(e) {}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const httpServer = createServer(app);

  // Setup Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // --- Market Simulation Engine (Server-Side) ---
  const assets: Record<string, { price: number, volatility: number, trend: number, isFrozen?: boolean, targetPrice?: number | null, winPercentage?: number, payout?: number }> = {
    'AUD/CHF': { price: 0.5720, volatility: 0.0002, trend: 0, winPercentage: 50, payout: 90 },
    'AUD/JPY': { price: 97.50, volatility: 0.02, trend: 0, winPercentage: 50, payout: 90 },
    'AUD/USD': { price: 0.6550, volatility: 0.0002, trend: 0, winPercentage: 50, payout: 90 },
    'EUR/AUD': { price: 1.6550, volatility: 0.0002, trend: 0, winPercentage: 50, payout: 90 },
    'EUR/CAD': { price: 1.4650, volatility: 0.0002, trend: 0, winPercentage: 50, payout: 90 },
    'EUR/GBP': { price: 0.8550, volatility: 0.0002, trend: 0, winPercentage: 50, payout: 90 },
    'EUR/JPY': { price: 163.50, volatility: 0.02, trend: 0, winPercentage: 50, payout: 90 },
    'EUR/USD': { price: 1.0845, volatility: 0.0002, trend: 0, winPercentage: 50, payout: 90 },
    'GBP/AUD': { price: 1.9350, volatility: 0.0003, trend: 0, winPercentage: 50, payout: 90 },
    'GBP/CAD': { price: 1.7150, volatility: 0.0003, trend: 0, winPercentage: 50, payout: 90 },
    'GBP/CHF': { price: 1.1350, volatility: 0.0003, trend: 0, winPercentage: 50, payout: 90 },
    'GBP/USD': { price: 1.2670, volatility: 0.0003, trend: 0, winPercentage: 50, payout: 90 },
    'NZD/USD': { price: 0.6150, volatility: 0.0002, trend: 0, winPercentage: 50, payout: 90 },
    'USD/AED': { price: 3.67, volatility: 0.001, trend: 0, winPercentage: 50, payout: 90 },
    'USD/ARS': { price: 830.50, volatility: 1.5, trend: 0, winPercentage: 50, payout: 90 },
    'USD/BDT': { price: 109.50, volatility: 0.5, trend: 0, winPercentage: 50, payout: 90 },
    'USD/BRL': { price: 4.95, volatility: 0.01, trend: 0, winPercentage: 50, payout: 90 },
    'USD/CAD': { price: 1.3550, volatility: 0.0002, trend: 0, winPercentage: 50, payout: 90 },
    'USD/CHF': { price: 0.8850, volatility: 0.0002, trend: 0, winPercentage: 50, payout: 90 },
    'USD/COP': { price: 3950.50, volatility: 5.0, trend: 0, winPercentage: 50, payout: 90 },
    'USD/DZD': { price: 134.50, volatility: 0.5, trend: 0, winPercentage: 50, payout: 90 },
    'USD/EGP': { price: 30.90, volatility: 0.1, trend: 0, winPercentage: 50, payout: 90 },
    'USD/IDR': { price: 15600.0, volatility: 20.0, trend: 0, winPercentage: 50, payout: 90 },
    'USD/INR': { price: 83.00, volatility: 0.1, trend: 0, winPercentage: 50, payout: 90 },
    'USD/JPY': { price: 150.20, volatility: 0.01500, trend: 0, winPercentage: 50, payout: 90 },
    'USD/MXN': { price: 17.05, volatility: 0.05, trend: 0, winPercentage: 50, payout: 90 },
    'USD/PKR': { price: 279.50, volatility: 1.0, trend: 0, winPercentage: 50, payout: 90 },
    'USD/SAR': { price: 3.75, volatility: 0.001, trend: 0, winPercentage: 50, payout: 90 },
    'USD/TRY': { price: 31.20, volatility: 0.05, trend: 0, winPercentage: 50, payout: 90 },
    'USD/ZAR': { price: 19.10, volatility: 0.02, trend: 0, winPercentage: 50, payout: 90 },
    'BTC/USD': { price: 51241.67, volatility: 15.5, trend: 0, winPercentage: 50, payout: 90 },
    'ETH/USD': { price: 2950.12, volatility: 2.5, trend: 0, winPercentage: 50, payout: 90 },
    'SOL/USD': { price: 105.45, volatility: 0.8, trend: 0, winPercentage: 50, payout: 90 },
    'XRP/USD': { price: 0.54, volatility: 0.005, trend: 0, winPercentage: 50, payout: 90 },
    'GOLD': { price: 2035.50, volatility: 0.5, trend: 0, winPercentage: 50, payout: 90 },
    'SILVER': { price: 22.80, volatility: 0.05, trend: 0, winPercentage: 50, payout: 90 },
    'OIL': { price: 78.40, volatility: 0.2, trend: 0, winPercentage: 50, payout: 90 },
    'AAPL': { price: 182.30, volatility: 0.5, trend: 0, winPercentage: 50, payout: 90 },
    'GOOGL': { price: 145.60, volatility: 0.4, trend: 0, winPercentage: 50, payout: 90 },
    'TSLA': { price: 195.20, volatility: 1.2, trend: 0, winPercentage: 50, payout: 90 },
    'AMZN': { price: 175.40, volatility: 0.6, trend: 0, winPercentage: 50, payout: 90 },
    'MSFT': { price: 410.50, volatility: 0.8, trend: 0, winPercentage: 50, payout: 90 },
    'META': { price: 485.20, volatility: 1.5, trend: 0, winPercentage: 50, payout: 90 },
    'NFLX': { price: 590.40, volatility: 1.0, trend: 0, winPercentage: 50, payout: 90 },
    'NVDA': { price: 785.30, volatility: 2.5, trend: 0, winPercentage: 50, payout: 90 },
    'BABA': { price: 75.20, volatility: 0.8, trend: 0, winPercentage: 50, payout: 90 },
    'DOGE/USD': { price: 0.085, volatility: 0.002, trend: 0, winPercentage: 50, payout: 90 },
    'ADA/USD': { price: 0.58, volatility: 0.01, trend: 0, winPercentage: 50, payout: 90 },
    'DOT/USD': { price: 7.45, volatility: 0.15, trend: 0, winPercentage: 50, payout: 90 },
    'COPPER': { price: 3.85, volatility: 0.02, trend: 0, winPercentage: 50, payout: 90 },
    'NATGAS': { price: 1.85, volatility: 0.05, trend: 0, winPercentage: 50, payout: 90 },
    'CORN': { price: 4.50, volatility: 0.02, trend: 0, winPercentage: 50, payout: 90 },
    'WHEAT': { price: 5.80, volatility: 0.03, trend: 0, winPercentage: 50, payout: 90 },
    'LINK/USD': { price: 18.50, volatility: 0.2, trend: 0, winPercentage: 50, payout: 90 },
    'MATIC/USD': { price: 0.95, volatility: 0.01, trend: 0, winPercentage: 50, payout: 90 },
    'UNI/USD': { price: 7.20, volatility: 0.1, trend: 0, winPercentage: 50, payout: 90 },
    'DIS': { price: 110.50, volatility: 0.4, trend: 0, winPercentage: 50, payout: 90 },
    'PYPL': { price: 60.20, volatility: 0.5, trend: 0, winPercentage: 50, payout: 90 },
    'NKE': { price: 105.40, volatility: 0.3, trend: 0, winPercentage: 50, payout: 90 },
  };

  // Store historical ticks (last 24 hours = 86400 ticks)
  const history: Record<string, any[]> = {};
  Object.keys(assets).forEach(symbol => {
    history[symbol] = [];
  });

  // Track active trades for admin panel
  const activeTrades: Record<string, any> = {};
  
  // Track connected users for admin panel
  const connectedUsers: Record<string, any> = {};

  // Global Trade Automation Settings
  let globalTradeSettings = {
    mode: 'FAIR', // 'FAIR', 'FORCE_LOSS', 'FORCE_WIN', 'PERCENTAGE'
    winPercentage: 50,
    payoutPercentage: 90
  };

  let globalDepositSettings = {
    bkashNumbers: ['01712-345678'],
    nagadNumbers: ['01712-345678'],
    rocketNumbers: ['01712-345678'],
    upayNumbers: ['01712-345678'],
    exchangeRate: 120,
    depositNote: 'Ensure you include your account ID in the reference if required. Deposits usually reflect within 5-15 minutes.',
    minDepositForBonus: 50,
    bonusPercentage: 10
  };

  let globalPlatformSettings = {
    isTradingEnabled: true,
    isDepositsEnabled: true,
    isWithdrawalsEnabled: true,
    isChatEnabled: true,
    maintenanceMode: false
  };

  // Load trade settings from DB
  const savedSettings = db.prepare('SELECT value FROM settings WHERE key = ?').get('trade_settings') as any;
  if (savedSettings) {
    globalTradeSettings = JSON.parse(savedSettings.value);
  }

  const savedAssetSettings = db.prepare('SELECT value FROM settings WHERE key = ?').get('asset_settings') as any;
  if (savedAssetSettings) {
    const parsed = JSON.parse(savedAssetSettings.value);
    Object.keys(parsed).forEach(symbol => {
      if (assets[symbol]) {
        assets[symbol] = { ...assets[symbol], ...parsed[symbol] };
      }
    });
  }

  const savedDepositSettings = db.prepare('SELECT value FROM settings WHERE key = ?').get('deposit_settings') as any;
  if (savedDepositSettings) {
    globalDepositSettings = { ...globalDepositSettings, ...JSON.parse(savedDepositSettings.value) };
  }

  const savedPlatformSettings = db.prepare('SELECT value FROM settings WHERE key = ?').get('platform_settings') as any;
  if (savedPlatformSettings) {
    globalPlatformSettings = { ...globalPlatformSettings, ...JSON.parse(savedPlatformSettings.value) };
  }

  const saveTradeSettings = (settings: any) => {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('trade_settings', JSON.stringify(settings));
  };

  const saveAssetSettings = () => {
    const toSave: Record<string, any> = {};
    Object.keys(assets).forEach(symbol => {
      toSave[symbol] = { winPercentage: assets[symbol].winPercentage, payout: assets[symbol].payout, volatility: assets[symbol].volatility };
    });
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('asset_settings', JSON.stringify(toSave));
  };

  const saveDepositSettings = (settings: any) => {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('deposit_settings', JSON.stringify(settings));
  };

  const savePlatformSettings = (settings: any) => {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('platform_settings', JSON.stringify(settings));
  };

  // Platform Financial Statistics
  const today = new Date().toISOString().split('T')[0];
  let platformStats = {
    totalTrades: 0,
    totalVolume: 0,
    totalProfit: 0, // Profit for users
    totalLoss: 0,   // Loss for users (Profit for platform)
    netPlatformProfit: 0,
    dailyStats: {
      trades: 0,
      volume: 0,
      profit: 0,
      loss: 0
    }
  };

  // Load stats from DB
  const loadStats = () => {
    const allTime = db.prepare('SELECT SUM(total_trades) as trades, SUM(total_volume) as volume, SUM(total_user_profit) as profit, SUM(total_user_loss) as loss FROM trade_stats').get() as any;
    const daily = db.prepare('SELECT * FROM trade_stats WHERE date = ?').get(today) as any;

    if (allTime && allTime.trades !== null) {
      platformStats.totalTrades = allTime.trades;
      platformStats.totalVolume = allTime.volume;
      platformStats.totalProfit = allTime.profit;
      platformStats.totalLoss = allTime.loss;
      platformStats.netPlatformProfit = allTime.loss - allTime.profit;
    }

    if (daily) {
      platformStats.dailyStats = {
        trades: daily.total_trades,
        volume: daily.total_volume,
        profit: daily.total_user_profit,
        loss: daily.total_user_loss
      };
    } else {
      // Initialize today's stats in DB
      db.prepare('INSERT OR IGNORE INTO trade_stats (date) VALUES (?)').run(today);
    }
  };
  loadStats();

  const saveTradeToStats = (amount: number, userProfit: number, isWin: boolean, accountType: string) => {
    if (accountType !== 'REAL') return; // Only track real balance trades as requested
    
    const userLoss = isWin ? 0 : amount;
    const net = userLoss - userProfit;

    db.prepare(`
      UPDATE trade_stats 
      SET total_trades = total_trades + 1,
          total_volume = total_volume + ?,
          total_user_profit = total_user_profit + ?,
          total_user_loss = total_user_loss + ?,
          house_net = house_net + ?
      WHERE date = ?
    `).run(amount, userProfit, userLoss, net, today);
    
    loadStats(); // Reload into memory
  };

  // Global Support & Tutorial Settings
  let globalSupportSettings = {
    telegram: 'https://t.me/onyxtrade_support',
    whatsapp: 'https://wa.me/1234567890',
    email: 'support@onyxtrade.com'
  };

  // Referral Settings
  let globalReferralSettings = {
    bonusAmount: 10, // Fixed bonus for referrer
    referralPercentage: 5, // Percentage of first deposit
    minDepositForBonus: 20
  };

  // Deposit & Withdrawal Requests
  let pendingRequests: any[] = [];
  
  // Global Notifications
  let globalNotifications: any[] = [];

  // Global Rewards
  let globalRewards: any[] = [
    {
      id: '1',
      title: '110% Deposit Bonus',
      description: 'Use LUNAR2026 when depositing $10.00+',
      category: 'Promo Code',
      value: 'LUNAR2026',
      badge: '110%',
      icon: 'Gift'
    },
    {
      id: '2',
      title: 'Advanced Status',
      description: 'Use UE5QMQZ0E8 depositing $250.00+',
      category: 'Promo Code',
      value: 'UE5QMQZ0E8',
      badge: 'UP TO 100%',
      icon: 'Zap'
    }
  ];

  let globalTutorials = [
    {
      id: '1',
      title: 'Binary Options Basics',
      description: 'Learn the fundamentals of digital options trading in 5 minutes.',
      link: 'https://youtube.com/watch?v=example1',
      category: 'Beginner',
      duration: '5:20'
    },
    {
      id: '2',
      title: 'Advanced Chart Analysis',
      description: 'Master technical indicators and price action strategies.',
      link: 'https://youtube.com/watch?v=example2',
      category: 'Advanced',
      duration: '12:45'
    }
  ];

  // Generate initial history (24 hours)
  const now = Date.now();
  const oneDayMs = 86400 * 1000;
  
  Object.keys(assets).forEach(symbol => {
    const asset = assets[symbol as keyof typeof assets];
    
    // Check if we already have history in DB
    const existingHistory = db.prepare('SELECT * FROM market_history WHERE symbol = ? ORDER BY time DESC LIMIT 1').get(symbol) as any;
    
    if (existingHistory && (now - existingHistory.time) < oneDayMs) {
      // Load existing history
      const rows = db.prepare('SELECT * FROM market_history WHERE symbol = ? AND time > ? ORDER BY time ASC').all(symbol, now - oneDayMs) as any[];
      history[symbol] = rows.map(r => ({
        time: r.time,
        price: r.close,
        open: r.open,
        high: r.high,
        low: r.low,
        close: r.close
      }));
      
      if (rows.length > 0) {
        asset.price = rows[rows.length - 1].close;
      }
      
      // If there's a gap between last history and now, fill it
      let lastTime = existingHistory.time;
      let currentPrice = existingHistory.close;
      let currentTrend = 0;
      
      const gapSeconds = Math.floor((now - lastTime) / 1000);
      if (gapSeconds > 1) {
        const insert = db.prepare('INSERT OR REPLACE INTO market_history (symbol, time, open, high, low, close) VALUES (?, ?, ?, ?, ?, ?)');
        const transaction = db.transaction((symbol, startTime, startPrice, count) => {
          let price = startPrice;
          for (let i = 1; i <= count; i++) {
            const time = startTime + i * 1000;
            currentTrend += (Math.random() - 0.5) * asset.volatility * 0.1;
            currentTrend *= 0.95;
            const move = (currentTrend + (Math.random() - 0.5) * asset.volatility * 1.2);
            const open = price;
            price += move;
            const close = price;
            const high = Math.max(open, close) + Math.random() * asset.volatility;
            const low = Math.min(open, close) - Math.random() * asset.volatility;
            
            insert.run(symbol, time, open, high, low, close);
            history[symbol].push({ time, price: close, open, high, low, close });
          }
          return price;
        });
        asset.price = transaction(symbol, lastTime, currentPrice, gapSeconds);
      }
    } else {
      // Generate new history
      let currentPrice = asset.price;
      let currentTrend = 0;
      const insert = db.prepare('INSERT OR REPLACE INTO market_history (symbol, time, open, high, low, close) VALUES (?, ?, ?, ?, ?, ?)');
      
      const transaction = db.transaction((symbol, startTime, startPrice) => {
        let price = startPrice;
        for (let i = 86400; i >= 0; i--) {
          const time = startTime - i * 1000;
          currentTrend += (Math.random() - 0.5) * asset.volatility * 0.1;
          currentTrend *= 0.95;
          
          const candleTypeRand = Math.random();
          let moveMultiplier = 1.0;
          if (candleTypeRand < 0.15) moveMultiplier = 0.1;
          else if (candleTypeRand < 0.35) moveMultiplier = 1.6;
          
          const move = (currentTrend + (Math.random() - 0.5) * asset.volatility * 1.2) * moveMultiplier;
          const open = price;
          price += move;
          const close = price;
          
          const wickRand = Math.random();
          let upperWickBase = Math.random() * asset.volatility * 1.2;
          let lowerWickBase = Math.random() * asset.volatility * 1.2;
          
          if (wickRand < 0.1) { upperWickBase *= 3.5; lowerWickBase *= 3.5; }
          else if (wickRand < 0.2) { lowerWickBase *= 4.5; upperWickBase *= 0.4; }
          else if (wickRand < 0.3) { upperWickBase *= 4.5; lowerWickBase *= 0.4; }

          const high = Math.max(open, close) + upperWickBase;
          const low = Math.min(open, close) - lowerWickBase;

          insert.run(symbol, time, open, high, low, close);
          history[symbol].push({ time, price: close, open, high, low, close });
        }
        return price;
      });
      asset.price = transaction(symbol, now, currentPrice);
    }
  });

  // Generate ticks every 200ms for smooth movement
  let tickCounter = 0;
  const insertTick = db.prepare('INSERT OR REPLACE INTO market_history (symbol, time, open, high, low, close) VALUES (?, ?, ?, ?, ?, ?)');
  
  setInterval(() => {
    const now = Date.now();
    const ticks: Record<string, any> = {};
    const isFullSecond = tickCounter % 5 === 0;

    Object.keys(assets).forEach(symbol => {
      const asset = assets[symbol];
      
      let newPrice = asset.price;
      
      if (!asset.isFrozen) {
        if (asset.targetPrice) {
          // Move towards target price (scaled for 200ms)
          const diff = asset.targetPrice - asset.price;
          const step = diff * 0.01; // Move 1% towards target each tick (smooth)
          newPrice += step;
          
          // If close enough, clear target
          if (Math.abs(diff) < asset.volatility * 0.02) {
            asset.targetPrice = null;
          }
        } else {
          // Natural movement logic (scaled for 200ms)
          asset.trend += (Math.random() - 0.5) * asset.volatility * 0.02;
          asset.trend *= 0.99;
          
          const candleTypeRand = Math.random();
          let moveMultiplier = 1.0;
          if (candleTypeRand < 0.15) moveMultiplier = 0.15; // Doji / Small body
          else if (candleTypeRand < 0.35) moveMultiplier = 1.5; // Healthy / Strong body
          
          const move = (asset.trend + (Math.random() - 0.5) * asset.volatility * 0.24) * moveMultiplier;
          newPrice += move;
        }
      }
      
      const wickRand = Math.random();
      let upperWickBase = (asset.isFrozen ? 0 : Math.random() * asset.volatility * 1.3);
      let lowerWickBase = (asset.isFrozen ? 0 : Math.random() * asset.volatility * 1.3);
      
      if (!asset.isFrozen) {
        if (wickRand < 0.08) { // Long shadows on both sides
          upperWickBase *= 3.8;
          lowerWickBase *= 3.8;
        } else if (wickRand < 0.18) { // Long lower shadow (Hammer)
          lowerWickBase *= 4.8;
          upperWickBase *= 0.3;
        } else if (wickRand < 0.28) { // Long upper shadow (Shooting Star)
          upperWickBase *= 4.8;
          lowerWickBase *= 0.3;
        }
      }

      const tick = {
        time: now,
        price: newPrice,
        open: asset.price,
        high: Math.max(asset.price, newPrice) + upperWickBase,
        low: Math.min(asset.price, newPrice) - lowerWickBase,
        close: newPrice,
        isFrozen: asset.isFrozen
      };
      
      ticks[symbol] = tick;
      
      // Only push to history every 1 second to keep it consistent
      if (isFullSecond) {
        history[symbol].push(tick);
        insertTick.run(symbol, Math.floor(now / 1000) * 1000, tick.open, tick.high, tick.low, tick.close);
        
        // Keep up to 24 hours of history (86,400 seconds)
        if (history[symbol].length > 86400) {
          history[symbol].shift(); 
        }
      }
      
      asset.price = newPrice;
    });

    // Broadcast to all connected clients
    io.emit('market-tick', ticks);
    
    // Broadcast active trades to admin every second
    if (isFullSecond) {
      io.to('admin-room').emit('admin-active-trades', Object.values(activeTrades));
      io.to('admin-room').emit('admin-users', Object.values(connectedUsers));
    }
    
    tickCounter++;
  }, 100);

  // Handle Client Connections
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Default user state
    connectedUsers[socket.id] = {
      id: socket.id,
      email: 'Anonymous',
      name: 'Guest',
      balance: 0,
      trades: []
    };

    // Handle user authentication/sync from client
    socket.on('user-sync', (userData) => {
      if (userData && userData.email) {
        // Fetch latest KYC status
        const kyc = db.prepare('SELECT status, rejectionReason FROM kyc_submissions WHERE email = ? ORDER BY submittedAt DESC LIMIT 1').get(userData.email) as any;
        
        // Upsert user into users table
        const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(userData.email);
        const now = Date.now();
        
        if (!existingUser) {
          db.prepare('INSERT INTO users (email, name, photoURL, uid, balance, demoBalance, createdAt, lastLogin, kycStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .run(userData.email, userData.name || userData.displayName || '', userData.photoURL || '', userData.uid || '', userData.balance || 0, userData.demoBalance || 10000, now, now, kyc ? kyc.status : 'NONE');
        } else {
          db.prepare('UPDATE users SET name = ?, photoURL = ?, uid = ?, lastLogin = ?, balance = ?, demoBalance = ?, kycStatus = ? WHERE email = ?')
            .run(userData.name || userData.displayName || existingUser.name || '', userData.photoURL || existingUser.photoURL || '', userData.uid || existingUser.uid || '', now, userData.balance || existingUser.balance, userData.demoBalance || existingUser.demoBalance, kyc ? kyc.status : existingUser.kycStatus, userData.email);
        }

        const userFromDb = db.prepare('SELECT * FROM users WHERE email = ?').get(userData.email) as any;
        
        connectedUsers[socket.id] = {
          ...connectedUsers[socket.id],
          ...userData,
          ...userFromDb,
          kycStatus: kyc ? kyc.status : 'NOT_SUBMITTED',
          kycRejectionReason: kyc ? kyc.rejectionReason : null,
          id: socket.id
        };
        
        // Refresh user list for admin
        const allUsers = db.prepare('SELECT * FROM users').all();
        io.to('admin-room').emit('admin-all-users', allUsers);
        
        // Send initial KYC status back
        socket.emit('kyc-status-updated', { 
          status: kyc ? kyc.status : 'NOT_SUBMITTED',
          reason: kyc ? kyc.rejectionReason : null
        });

        // If user is blocked, force logout
        if (userFromDb.status === 'BLOCKED') {
          socket.emit('force-logout');
        }
      }
    });

    // Send initial prices
    const initialPrices: Record<string, number> = {};
    Object.keys(assets).forEach(symbol => {
      initialPrices[symbol] = assets[symbol as keyof typeof assets].price;
    });
    socket.emit('initial-prices', initialPrices);

    // Handle history request
    socket.on('request-history', (assetShortName) => {
      socket.emit('asset-history', {
        asset: assetShortName,
        data: history[assetShortName] || []
      });
    });

    // Handle Trade Execution
    socket.on('place-trade', (trade) => {
      if (!globalPlatformSettings.isTradingEnabled) {
        socket.emit('trade-error', 'Trading is currently disabled for maintenance.');
        return;
      }
      console.log('Trade received:', trade);
      
      // Apply Global Automation Rules
      let forcedResult = undefined;
      if (globalTradeSettings.mode === 'FORCE_LOSS') {
        forcedResult = 'LOSS';
      } else if (globalTradeSettings.mode === 'FORCE_WIN') {
        forcedResult = 'WIN';
      } else if (globalTradeSettings.mode === 'PERCENTAGE') {
        const assetKey = trade.assetShortName || trade.asset;
        const asset = assets[assetKey as keyof typeof assets];
        const winPercentage = asset?.winPercentage || globalTradeSettings.winPercentage;
        const isWin = Math.random() * 100 < winPercentage;
        forcedResult = isWin ? 'WIN' : 'LOSS';
      }

      // Store active trade
      activeTrades[trade.id] = { ...trade, socketId: socket.id, forcedResult };
      
      // In a real app, we would validate balance and store in DB here
      // For now, we just acknowledge receipt
      socket.emit('trade-accepted', { id: trade.id, status: 'ACTIVE' });

      // Set a timer to resolve the trade
      const durationMs = trade.endTime - Date.now();
      
      // If there's a forced result, manipulate the price slightly before the trade ends
      if (forcedResult) {
        // Start manipulation earlier (e.g., halfway through the trade or at least 5 seconds before end)
        const manipulationTime = Math.max(0, Math.min(durationMs / 2, durationMs - 5000));
        setTimeout(() => {
          const activeTrade = activeTrades[trade.id];
          if (!activeTrade) return;
          const assetKey = activeTrade.assetShortName || activeTrade.asset;
          const asset = assets[assetKey as keyof typeof assets];
          if (!asset) return;

          const isUp = activeTrade.type === 'UP';
          const shouldWin = forcedResult === 'WIN';
          
          // Determine if we need to move price UP or DOWN
          const needsUp = (isUp && shouldWin) || (!isUp && !shouldWin);
          
          // Calculate a safe target price
          const offset = asset.volatility * 2; // Smaller offset for natural look
          
          // If the current price is already on the wrong side, we need a bigger target to pull it across
          const currentPrice = asset.price;
          let target = activeTrade.entryPrice + (needsUp ? offset : -offset);
          
          if (needsUp && currentPrice < activeTrade.entryPrice) {
             target = activeTrade.entryPrice + Math.abs(activeTrade.entryPrice - currentPrice) + offset;
          } else if (!needsUp && currentPrice > activeTrade.entryPrice) {
             target = activeTrade.entryPrice - Math.abs(activeTrade.entryPrice - currentPrice) - offset;
          }
          
          asset.targetPrice = target;
        }, manipulationTime);
      }

      setTimeout(() => {
        const activeTrade = activeTrades[trade.id];
        if (!activeTrade) return; // Trade might have been forced by admin

        const assetKey = activeTrade.assetShortName || activeTrade.asset;
        const currentPrice = assets[assetKey as keyof typeof assets]?.price || activeTrade.entryPrice;
        
        // Check if admin forced a result
        let isWin = false;
        let finalClosePrice = currentPrice;
        
        if (activeTrade.forcedResult) {
          isWin = activeTrade.forcedResult === 'WIN';
          const isUp = activeTrade.type === 'UP';
          const needsUp = (isUp && isWin) || (!isUp && !isWin);
          
          // Ensure final close price is on the correct side
          const volatility = assets[assetKey as keyof typeof assets]?.volatility || 0.001;
          if (needsUp && finalClosePrice <= activeTrade.entryPrice) {
            finalClosePrice = activeTrade.entryPrice + volatility;
          } else if (!needsUp && finalClosePrice >= activeTrade.entryPrice) {
            finalClosePrice = activeTrade.entryPrice - volatility;
          }
          
          // Update the asset price to match the forced close price so the chart doesn't jump back
          if (assets[assetKey as keyof typeof assets]) {
             assets[assetKey as keyof typeof assets].price = finalClosePrice;
          }
        } else {
          isWin = activeTrade.type === 'UP' 
            ? currentPrice > activeTrade.entryPrice 
            : currentPrice < activeTrade.entryPrice;
        }
        
        const profit = isWin ? activeTrade.amount * (activeTrade.payout / 100) : 0;
        
        // Update Platform Stats in DB (Live Balance only)
        saveTradeToStats(activeTrade.amount, profit, isWin, activeTrade.accountType);

        // Broadcast stats to admin
        io.to('admin-room').emit('admin-stats', platformStats);

        socket.emit('trade-result', {
          id: activeTrade.id,
          status: isWin ? 'WIN' : 'LOSS',
          closePrice: finalClosePrice,
          profit: profit
        });
        
        delete activeTrades[activeTrade.id];
      }, durationMs);
    });

    // --- Admin Events ---
    socket.on('get-deposit-settings', () => {
      socket.emit('deposit-settings', globalDepositSettings);
    });

    socket.on('admin-join', (email) => {
      const adminEmails = ['hasan@gmail.com', 'tasmeaykhatun565@gmail.com'];
      if (email && adminEmails.includes(email.toLowerCase())) {
        socket.join('admin-room');
        socket.emit('admin-assets', assets);
        socket.emit('admin-trade-settings', globalTradeSettings);
        socket.emit('admin-support-settings', globalSupportSettings);
        socket.emit('admin-tutorials', globalTutorials);
        socket.emit('admin-referral-settings', globalReferralSettings);
        socket.emit('admin-requests', pendingRequests);
        socket.emit('admin-notifications', globalNotifications);
        socket.emit('admin-rewards', globalRewards);
        socket.emit('admin-deposit-settings', globalDepositSettings);
        socket.emit('admin-users', Object.values(connectedUsers));
        socket.emit('admin-stats', platformStats);
        socket.emit('admin-platform-settings', globalPlatformSettings);
        
        const allDeposits = db.prepare('SELECT * FROM deposits ORDER BY submittedAt DESC').all();
        socket.emit('admin-deposits', allDeposits);
        
        const allWithdrawals = db.prepare('SELECT * FROM withdrawals ORDER BY submittedAt DESC').all();
        socket.emit('admin-withdrawals', allWithdrawals);
      }
    });

    socket.on('admin-update-payout', ({ assetId, payout }) => {
      if (assets[assetId]) {
        assets[assetId].payout = payout;
        saveAssetSettings();
      }
      io.emit('asset-payout-updated', { assetId, payout });
    });

    socket.on('admin-reset-daily-stats', () => {
      platformStats.dailyStats = { trades: 0, volume: 0, profit: 0, loss: 0 };
      io.to('admin-room').emit('admin-stats', platformStats);
    });

    // Send initial support settings to all users
    socket.emit('support-settings', globalSupportSettings);
    socket.emit('tutorials', globalTutorials);
    socket.emit('referral-settings', globalReferralSettings);
    socket.emit('rewards', globalRewards);
    socket.emit('platform-settings', globalPlatformSettings);

    socket.on('user-update', (userData) => {
      if (userData && userData.email) {
        connectedUsers[socket.id] = {
          ...userData,
          socketId: socket.id,
          lastSeen: Date.now()
        };
        io.to('admin-room').emit('admin-users', Object.values(connectedUsers));
      }
    });

    socket.on('submit-request', (request) => {
      const newRequest = {
        ...request,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        status: 'PENDING'
      };
      pendingRequests.push(newRequest);
      io.to('admin-room').emit('admin-requests', pendingRequests);
      // Notify admin
      io.to('admin-room').emit('new-request-notification', newRequest);
    });

    socket.on('admin-update-request-status', ({ requestId, status, message }) => {
      const requestIndex = pendingRequests.findIndex(r => r.id === requestId);
      if (requestIndex !== -1) {
        pendingRequests[requestIndex].status = status;
        pendingRequests[requestIndex].adminMessage = message;
        
        // Notify the specific user if they are connected
        const userEmail = pendingRequests[requestIndex].userEmail;
        const userSocket = Object.values(connectedUsers).find(u => u.email === userEmail);
        if (userSocket) {
          io.to(userSocket.socketId).emit('request-status-updated', {
            requestId,
            status,
            message
          });
        }
        
        io.to('admin-room').emit('admin-requests', pendingRequests);
      }
    });

    socket.on('admin-send-notification', (notification) => {
      const newNotification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now()
      };
      globalNotifications.push(newNotification);
      io.emit('new-notification', newNotification);
      io.to('admin-room').emit('admin-notifications', globalNotifications);
    });

    socket.on('admin-update-referral-settings', (settings) => {
      globalReferralSettings = { ...globalReferralSettings, ...settings };
      io.emit('referral-settings', globalReferralSettings);
      io.to('admin-room').emit('admin-referral-settings', globalReferralSettings);
    });

    // --- Live Agent Chat ---
    socket.on('join-chat', (email) => {
      socket.join(`chat-${email}`);
      console.log(`User ${email} joined chat room`);
    });

    socket.on('admin-join-chat', (email) => {
      socket.join(`chat-${email}`);
      console.log(`Admin joined chat room for ${email}`);
    });

    socket.on('chat-message', ({ email, text, sender }) => {
      const message = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        sender,
        timestamp: Date.now()
      };
      io.to(`chat-${email}`).emit('new-chat-message', message);
      io.to('admin-room').emit('admin-new-chat-message', { email, message });
    });

    socket.on('admin-chat-message', ({ email, text, sender }) => {
      const message = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        sender,
        timestamp: Date.now()
      };
      io.to(`chat-${email}`).emit('new-chat-message', message);
    });

    socket.on('admin-boost-user', ({ email, isBoosted }) => {
      const user = Object.values(connectedUsers).find(u => u.email === email);
      if (user) {
        user.isBoosted = isBoosted;
        io.to(user.socketId).emit('account-boosted', isBoosted);
      }
      
      db.prepare('UPDATE users SET isBoosted = ? WHERE email = ?').run(isBoosted ? 1 : 0, email);
      
      // Refresh user list for admin
      const allUsers = db.prepare('SELECT * FROM users').all();
      io.to('admin-room').emit('admin-all-users', allUsers);
      io.to('admin-room').emit('admin-users', Object.values(connectedUsers));
    });

    socket.on('admin-get-all-users', () => {
      const allUsers = db.prepare('SELECT * FROM users').all();
      socket.emit('admin-all-users', allUsers);
    });

    socket.on('admin-update-user-balance', ({ email, balance, type }) => {
      try {
        if (type === 'REAL') {
          db.prepare('UPDATE users SET balance = ? WHERE email = ?').run(balance, email);
        } else {
          db.prepare('UPDATE users SET demoBalance = ? WHERE email = ?').run(balance, email);
        }
        
        // Notify user if connected
        const user = Object.values(connectedUsers).find(u => u.email === email);
        if (user) {
          if (type === 'REAL') user.balance = balance;
          else user.demoBalance = balance;
          io.to(user.socketId).emit('balance-updated', { balance, type });
        }
        
        // Refresh admin user list
        const allUsers = db.prepare('SELECT * FROM users').all();
        io.to('admin-room').emit('admin-all-users', allUsers);
      } catch (error) {
        console.error('Update Balance Error:', error);
      }
    });

    socket.on('admin-update-user-status', ({ email, status }) => {
      try {
        db.prepare('UPDATE users SET status = ? WHERE email = ?').run(status, email);
        
        // Notify user if connected
        const user = Object.values(connectedUsers).find(u => u.email === email);
        if (user) {
          user.status = status;
          io.to(user.socketId).emit('status-updated', status);
          if (status === 'BLOCKED') {
            io.to(user.socketId).emit('force-logout');
          }
        }
        
        // Refresh admin user list
        const allUsers = db.prepare('SELECT * FROM users').all();
        io.to('admin-room').emit('admin-all-users', allUsers);
      } catch (error) {
        console.error('Update Status Error:', error);
      }
    });

    socket.on('admin-send-notification-all', (notification) => {
      try {
        const { title, message, type } = notification;
        const now = Date.now();
        
        // In a real app, we might save this to a notifications table
        // For now, we just broadcast it to all connected users
        io.emit('new-notification', {
          id: now.toString(),
          title,
          message,
          type,
          timestamp: now
        });
        
        console.log('Broadcasted notification to all users:', title);
      } catch (error) {
        console.error('Broadcast Notification Error:', error);
      }
    });

    socket.on('admin-delete-user', (email) => {
      try {
        db.prepare('DELETE FROM users WHERE email = ?').run(email);
        db.prepare('DELETE FROM deposits WHERE email = ?').run(email);
        db.prepare('DELETE FROM withdrawals WHERE email = ?').run(email);
        db.prepare('DELETE FROM kyc_submissions WHERE email = ?').run(email);
        
        // Force logout if connected
        const user = Object.values(connectedUsers).find(u => u.email === email);
        if (user) {
          io.to(user.socketId).emit('force-logout');
        }
        
        // Refresh admin user list
        const allUsers = db.prepare('SELECT * FROM users').all();
        io.to('admin-room').emit('admin-all-users', allUsers);
      } catch (error) {
        console.error('Delete User Error:', error);
      }
    });

    socket.on('admin-update-deposit-settings', (settings) => {
      globalDepositSettings = settings;
      saveDepositSettings(settings);
      io.emit('deposit-settings', globalDepositSettings);
      io.to('admin-room').emit('admin-deposit-settings', globalDepositSettings);
    });

    socket.on('admin-update-trade-settings', (settings) => {
      globalTradeSettings = { ...globalTradeSettings, ...settings };
      saveTradeSettings(globalTradeSettings);
      io.to('admin-room').emit('admin-trade-settings', globalTradeSettings);
      
      if (settings.payoutPercentage !== undefined) {
        io.emit('global-payout-updated', settings.payoutPercentage);
      }
    });

    socket.on('admin-update-support-settings', (settings) => {
      globalSupportSettings = { ...globalSupportSettings, ...settings };
      io.emit('support-settings', globalSupportSettings);
      io.to('admin-room').emit('admin-support-settings', globalSupportSettings);
    });

    socket.on('admin-update-platform-settings', (settings) => {
      globalPlatformSettings = { ...globalPlatformSettings, ...settings };
      savePlatformSettings(globalPlatformSettings);
      io.emit('platform-settings', globalPlatformSettings);
      io.to('admin-room').emit('admin-platform-settings', globalPlatformSettings);
    });

    socket.on('admin-update-tutorials', (tutorials) => {
      globalTutorials = tutorials;
      io.emit('tutorials', globalTutorials);
      io.to('admin-room').emit('admin-tutorials', globalTutorials);
    });

    socket.on('admin-add-reward', (reward) => {
      const newReward = {
        ...reward,
        id: Math.random().toString(36).substr(2, 9)
      };
      globalRewards.push(newReward);
      io.emit('rewards', globalRewards);
      io.to('admin-room').emit('admin-rewards', globalRewards);
    });

    socket.on('admin-delete-reward', (id) => {
      globalRewards = globalRewards.filter(r => r.id !== id);
      io.emit('rewards', globalRewards);
      io.to('admin-room').emit('admin-rewards', globalRewards);
    });

    socket.on('admin-set-trend', ({ asset, trend }) => {
      if (assets[asset]) {
        assets[asset].trend = trend;
      }
    });

    socket.on('admin-set-volatility', ({ asset, volatility }) => {
      if (assets[asset]) {
        assets[asset].volatility = volatility;
        saveAssetSettings();
      }
    });

    socket.on('admin-set-win-percentage', ({ asset, winPercentage }) => {
      if (assets[asset]) {
        assets[asset].winPercentage = winPercentage;
        saveAssetSettings();
      }
    });

    socket.on('admin-set-price', ({ asset, price }) => {
      if (assets[asset]) {
        assets[asset].price = price;
      }
    });

    socket.on('admin-set-target', ({ asset, targetPrice }) => {
      if (assets[asset]) {
        assets[asset].targetPrice = targetPrice;
      }
    });

    socket.on('admin-toggle-freeze', ({ asset, isFrozen }) => {
      if (assets[asset]) {
        assets[asset].isFrozen = isFrozen;
      }
    });

    // --- Deposit Events ---
    socket.on('submit-deposit', (depositData) => {
      if (!globalPlatformSettings.isDepositsEnabled) {
        socket.emit('deposit-error', 'Deposits are currently disabled.');
        return;
      }
      try {
        const { email, amount, currency, method, transactionId } = depositData;
        
        let bonusAmount = 0;
        if (amount >= globalDepositSettings.minDepositForBonus) {
          bonusAmount = amount * (globalDepositSettings.bonusPercentage / 100);
        }

        const stmt = db.prepare(`
          INSERT INTO deposits (email, amount, currency, method, transactionId, submittedAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        const now = Date.now();
        stmt.run(email, amount, currency, method, transactionId, now, now);
        
        socket.emit('deposit-submitted', { status: 'PENDING', bonusAmount });
        
        // Notify admins
        io.to('admin-room').emit('new-deposit-notification', { email, amount, method, transactionId, bonusAmount, submittedAt: now });
        
        const allDeposits = db.prepare('SELECT * FROM deposits ORDER BY submittedAt DESC').all();
        io.to('admin-room').emit('admin-deposits', allDeposits);
        
      } catch (error) {
        console.error('Deposit Submission Error:', error);
        socket.emit('deposit-error', 'Failed to submit deposit. Please try again.');
      }
    });

    socket.on('admin-update-deposit-status', ({ id, status }) => {
      try {
        const deposit = db.prepare('SELECT * FROM deposits WHERE id = ?').get(id) as any;
        if (!deposit) return;

        const oldStatus = deposit.status;
        if (oldStatus === status) return;

        db.prepare('UPDATE deposits SET status = ?, updatedAt = ? WHERE id = ?').run(status, Date.now(), id);

        // If approved, add funds to user balance
        if (status === 'APPROVED' && oldStatus === 'PENDING') {
          const user = db.prepare('SELECT balance FROM users WHERE email = ?').get(deposit.email) as any;
          if (user) {
            const newBalance = user.balance + deposit.amount;
            db.prepare('UPDATE users SET balance = ? WHERE email = ?').run(newBalance, deposit.email);
            
            const connectedUser = Object.values(connectedUsers).find(u => u.email === deposit.email);
            if (connectedUser) {
              connectedUser.balance = newBalance;
              io.to(connectedUser.socketId).emit('balance-updated', { balance: newBalance, type: 'REAL' });
            }
          }
        }

        const allDeposits = db.prepare('SELECT * FROM deposits ORDER BY submittedAt DESC').all();
        io.to('admin-room').emit('admin-deposits', allDeposits);
      } catch (error) {
        console.error('Error updating deposit status:', error);
      }
    });

    // --- Withdraw Events ---
    socket.on('submit-withdraw', (withdrawData) => {
      if (!globalPlatformSettings.isWithdrawalsEnabled) {
        socket.emit('withdraw-error', 'Withdrawals are currently disabled.');
        return;
      }
      try {
        const { email, amount, currency, method, accountDetails } = withdrawData;
        
        // Check user balance
        const user = db.prepare('SELECT balance FROM users WHERE email = ?').get(email) as any;
        if (!user || user.balance < amount) {
          socket.emit('withdraw-error', 'Insufficient balance.');
          return;
        }

        // Deduct balance immediately
        const newBalance = user.balance - amount;
        db.prepare('UPDATE users SET balance = ? WHERE email = ?').run(newBalance, email);

        const stmt = db.prepare(`
          INSERT INTO withdrawals (email, amount, currency, method, accountDetails, status, submittedAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, 'PENDING', ?, ?)
        `);
        
        const now = Date.now();
        const info = stmt.run(email, amount, currency, method, accountDetails, now, now);
        const withdrawalId = info.lastInsertRowid;
        
        // Update connected user balance
        const connectedUser = Object.values(connectedUsers).find(u => u.email === email);
        if (connectedUser) {
          connectedUser.balance = newBalance;
          io.to(connectedUser.socketId).emit('balance-updated', { balance: newBalance, type: 'REAL' });
        }

        socket.emit('withdraw-submitted', { id: withdrawalId, status: 'PENDING', newBalance });
        
        // Notify admins
        io.to('admin-room').emit('new-withdraw-notification', { id: withdrawalId, email, amount, method, accountDetails, submittedAt: now });
        
        const allWithdrawals = db.prepare('SELECT * FROM withdrawals ORDER BY submittedAt DESC').all();
        io.to('admin-room').emit('admin-withdrawals', allWithdrawals);
        
      } catch (error) {
        console.error('Withdraw Submission Error:', error);
        socket.emit('withdraw-error', 'Failed to submit withdrawal. Please try again.');
      }
    });

    socket.on('cancel-withdrawal', ({ id, email }) => {
      try {
        const withdrawal = db.prepare('SELECT * FROM withdrawals WHERE id = ? AND email = ? AND status = \'PENDING\'').get(id, email) as any;
        if (!withdrawal) {
          socket.emit('withdraw-error', 'Withdrawal not found or already processed.');
          return;
        }

        // Update status to CANCELLED
        db.prepare('UPDATE withdrawals SET status = \'CANCELLED\', updatedAt = ? WHERE id = ?').run(Date.now(), id);

        // Return balance to user
        const user = db.prepare('SELECT balance FROM users WHERE email = ?').get(email) as any;
        if (user) {
          const newBalance = user.balance + withdrawal.amount;
          db.prepare('UPDATE users SET balance = ? WHERE email = ?').run(newBalance, email);
          
          const connectedUser = Object.values(connectedUsers).find(u => u.email === email);
          if (connectedUser) {
            connectedUser.balance = newBalance;
            io.to(connectedUser.socketId).emit('balance-updated', { balance: newBalance, type: 'REAL' });
          }
          socket.emit('withdrawal-cancelled', { id, newBalance });
        }

        // Refresh admin list
        const allWithdrawals = db.prepare('SELECT * FROM withdrawals ORDER BY submittedAt DESC').all();
        io.to('admin-room').emit('admin-withdrawals', allWithdrawals);
      } catch (error) {
        console.error('Cancel Withdrawal Error:', error);
        socket.emit('withdraw-error', 'Failed to cancel withdrawal.');
      }
    });

    socket.on('admin-update-withdraw-status', ({ id, status }) => {
      try {
        const withdrawal = db.prepare('SELECT * FROM withdrawals WHERE id = ?').get(id) as any;
        if (!withdrawal) return;

        const oldStatus = withdrawal.status;
        if (oldStatus === status) return;

        db.prepare('UPDATE withdrawals SET status = ?, updatedAt = ? WHERE id = ?').run(status, Date.now(), id);

        // If rejected or cancelled, return funds to user balance
        if ((status === 'REJECTED' || status === 'CANCELLED') && oldStatus === 'PENDING') {
          const user = db.prepare('SELECT balance FROM users WHERE email = ?').get(withdrawal.email) as any;
          if (user) {
            const newBalance = user.balance + withdrawal.amount;
            db.prepare('UPDATE users SET balance = ? WHERE email = ?').run(newBalance, withdrawal.email);
            
            const connectedUser = Object.values(connectedUsers).find(u => u.email === withdrawal.email);
            if (connectedUser) {
              connectedUser.balance = newBalance;
              io.to(connectedUser.socketId).emit('balance-updated', { balance: newBalance, type: 'REAL' });
            }
          }
        }

        const allWithdrawals = db.prepare('SELECT * FROM withdrawals ORDER BY submittedAt DESC').all();
        io.to('admin-room').emit('admin-withdrawals', allWithdrawals);
      } catch (error) {
        console.error('Error updating withdraw status:', error);
      }
    });

    // --- KYC Events ---
    socket.on('submit-kyc', (kycData) => {
      console.log('KYC Submission Data:', kycData);
      try {
        const { email, documentType, documentNumber, fullName, dateOfBirth, frontImage, backImage } = kycData;
        
        if (!email || !documentType || !documentNumber || !fullName || !dateOfBirth || !frontImage) {
          socket.emit('kyc-error', 'Missing required fields.');
          return;
        }
        
        // Check if user already has a pending or verified KYC
        const existing = db.prepare('SELECT status FROM kyc_submissions WHERE email = ? AND (status = \'PENDING\' OR status = \'VERIFIED\')').get(email);
        
        if (existing) {
          socket.emit('kyc-error', 'You already have a pending or verified KYC submission.');
          return;
        }

        const stmt = db.prepare(`
          INSERT INTO kyc_submissions (email, documentType, documentNumber, fullName, dateOfBirth, frontImage, backImage, submittedAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const now = Date.now();
        stmt.run(email, documentType, documentNumber, fullName, dateOfBirth, frontImage, backImage, now, now);
        
        // Update user status in memory
        const user = Object.values(connectedUsers).find(u => u.email === email);
        if (user) {
          user.kycStatus = 'PENDING';
          io.to(user.socketId).emit('kyc-status-updated', { status: 'PENDING' });
        }

        socket.emit('kyc-submitted', { status: 'PENDING' });
        
        // Notify admins
        io.to('admin-room').emit('new-kyc-notification', { email, fullName, submittedAt: now });
        
        // Refresh admin KYC list
        const allKyc = db.prepare('SELECT * FROM kyc_submissions ORDER BY submittedAt DESC').all();
        io.to('admin-room').emit('admin-kyc-list', allKyc);
      } catch (error) {
        console.error('KYC Submission Error:', error);
        socket.emit('kyc-error', 'Failed to submit KYC. Please try again.');
      }
    });

    socket.on('get-kyc-status', (email) => {
      const kyc = db.prepare('SELECT status, rejectionReason FROM kyc_submissions WHERE email = ? ORDER BY submittedAt DESC LIMIT 1').get(email);
      socket.emit('kyc-status', kyc || { status: 'NOT_SUBMITTED' });
    });

    socket.on('admin-get-kyc-list', () => {
      const allKyc = db.prepare('SELECT * FROM kyc_submissions ORDER BY submittedAt DESC').all();
      socket.emit('admin-kyc-list', allKyc);
    });

    socket.on('admin-update-kyc-status', ({ id, status, reason }) => {
      try {
        const now = Date.now();
        db.prepare('UPDATE kyc_submissions SET status = ?, rejectionReason = ?, updatedAt = ? WHERE id = ?')
          .run(status, reason || null, now, id);
        
        const kyc = db.prepare('SELECT email FROM kyc_submissions WHERE id = ?').get(id) as any;
        
        if (kyc) {
          // Notify the user if connected
          const userSocket = Object.values(connectedUsers).find(u => u.email === kyc.email);
          if (userSocket) {
            io.to(userSocket.socketId).emit('kyc-status-updated', { status, reason });
          }
        }
        
        // Refresh admin KYC list
        const allKyc = db.prepare('SELECT * FROM kyc_submissions ORDER BY submittedAt DESC').all();
        io.to('admin-room').emit('admin-kyc-list', allKyc);
      } catch (error) {
        console.error('Admin KYC Update Error:', error);
      }
    });

    socket.on('admin-pump-dump', ({ asset, amount }) => {
      if (assets[asset]) {
        assets[asset].price += amount;
      }
    });

    socket.on('admin-force-trade', ({ tradeId, result }) => {
      if (activeTrades[tradeId]) {
        activeTrades[tradeId].forcedResult = result; // 'WIN' or 'LOSS'
        
        // Immediately manipulate price if forced manually
        const activeTrade = activeTrades[tradeId];
        const assetKey = activeTrade.assetShortName || activeTrade.asset;
        const asset = assets[assetKey as keyof typeof assets];
        if (asset) {
          const isUp = activeTrade.type === 'UP';
          const shouldWin = result === 'WIN';
          const needsUp = (isUp && shouldWin) || (!isUp && !shouldWin);
          const offset = asset.volatility * 2;
          
          const currentPrice = asset.price;
          let target = activeTrade.entryPrice + (needsUp ? offset : -offset);
          
          if (needsUp && currentPrice < activeTrade.entryPrice) {
             target = activeTrade.entryPrice + Math.abs(activeTrade.entryPrice - currentPrice) + offset;
          } else if (!needsUp && currentPrice > activeTrade.entryPrice) {
             target = activeTrade.entryPrice - Math.abs(activeTrade.entryPrice - currentPrice) - offset;
          }
          
          asset.targetPrice = target;
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      delete connectedUsers[socket.id];
    });
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: Date.now() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

function updateDailyStats(amount: number, profit: number, isWin: boolean) {
  const date = new Date().toISOString().split('T')[0];
  const stats = db.prepare('SELECT * FROM trade_stats WHERE date = ?').get(date) as any;
  
  const userProfit = isWin ? profit : 0;
  const userLoss = isWin ? 0 : amount;
  const houseNet = userLoss - userProfit;

  if (stats) {
    db.prepare(`
      UPDATE trade_stats 
      SET total_trades = total_trades + 1,
          total_volume = total_volume + ?,
          total_user_profit = total_user_profit + ?,
          total_user_loss = total_user_loss + ?,
          house_net = house_net + ?
      WHERE date = ?
    `).run(amount, userProfit, userLoss, houseNet, date);
  } else {
    db.prepare(`
      INSERT INTO trade_stats (date, total_trades, total_volume, total_user_profit, total_user_loss, house_net)
      VALUES (?, 1, ?, ?, ?, ?)
    `).run(date, amount, userProfit, userLoss, houseNet);
  }
}

function saveTradeSettings(settings: any) {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('trade_settings', JSON.stringify(settings));
}

startServer();
