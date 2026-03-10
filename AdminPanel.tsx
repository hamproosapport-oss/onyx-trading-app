import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { 
  ChevronLeft, TrendingUp, TrendingDown, Users, Activity, Settings, Zap, 
  Anchor, Play, Pause, Target, HelpCircle, X, Gift, Bell, CreditCard, 
  Check, Trash2, ShieldCheck, ShieldAlert, User, ArrowUp, ArrowDown, 
  Percent, Info, Send, Phone, Mail, Video, Trophy, FileText, Plus, BarChart2, Wallet, RefreshCw, CheckCircle2, XCircle, Search,
  ArrowUpCircle, ArrowDownCircle, MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';

interface AdminPanelProps {
  socket: Socket | null;
  onBack: () => void;
  userEmail: string;
}

const AssetControl: React.FC<{ symbol: string, asset: any, socket: Socket | null }> = ({ symbol, asset, socket }) => {
  const [customPrice, setCustomPrice] = useState<string>('');
  const [targetPrice, setTargetPrice] = useState<string>('');

  const handleSetTrend = (trend: number) => {
    if (socket) socket.emit('admin-set-trend', { asset: symbol, trend });
  };

  const handleSetVolatility = (volatility: number) => {
    if (socket) socket.emit('admin-set-volatility', { asset: symbol, volatility });
  };

  const handleSetPrice = () => {
    if (socket && customPrice) {
      socket.emit('admin-set-price', { asset: symbol, price: parseFloat(customPrice) });
      setCustomPrice('');
    }
  };

  const handleSetTarget = () => {
    if (socket) {
      if (targetPrice) {
        socket.emit('admin-set-target', { asset: symbol, targetPrice: parseFloat(targetPrice) });
      } else {
        socket.emit('admin-set-target', { asset: symbol, targetPrice: null });
      }
    }
  };

  const handleToggleFreeze = () => {
    if (socket) socket.emit('admin-toggle-freeze', { asset: symbol, isFrozen: !asset.isFrozen });
  };

  const handlePumpDump = (multiplier: number) => {
    if (socket) {
      const amount = (asset.volatility || 0.001) * multiplier * 100;
      socket.emit('admin-pump-dump', { asset: symbol, amount });
    }
  };

  const handleUpdatePayout = (payout: number) => {
    if (socket) {
      socket.emit('admin-update-payout', { assetId: symbol, payout });
    }
  };

  const handleUpdateWinPercentage = (winPercentage: number) => {
    if (socket) {
      socket.emit('admin-set-win-percentage', { asset: symbol, winPercentage });
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-xl hover:border-[var(--border-color)] transition-colors">
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
              <Activity size={18} />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--text-primary)]">{symbol}</div>
              <div className="flex gap-1 mt-0.5">
                {asset.isFrozen && <span className="bg-blue-500/20 text-blue-500 text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest">FROZEN</span>}
                {asset.targetPrice && <span className="bg-purple-500/20 text-purple-500 text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest">TARGET: {asset.targetPrice}</span>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono font-black text-[var(--text-secondary)]">{asset.price?.toFixed(5)}</div>
            <div className="text-[9px] text-[var(--text-secondary)] font-bold uppercase">Live Price</div>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Trend Control */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider">Trend Control</label>
            <span className="text-[10px] font-mono text-blue-400">{asset.trend?.toFixed(6)}</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => handleSetTrend((asset.trend || 0) + 0.001)} className="flex-1 bg-green-500/10 text-green-500 py-2 rounded-xl flex justify-center items-center hover:bg-green-500/20 transition active:scale-95 border border-green-500/10"><TrendingUp size={16} /></button>
            <button onClick={() => handleSetTrend(0)} className="px-4 bg-[var(--bg-primary)] text-[var(--text-secondary)] py-2 rounded-xl text-[10px] font-black uppercase hover:text-[var(--text-primary)] transition active:scale-95 border border-[var(--border-color)]">Reset</button>
            <button onClick={() => handleSetTrend((asset.trend || 0) - 0.001)} className="flex-1 bg-red-500/10 text-red-500 py-2 rounded-xl flex justify-center items-center hover:bg-red-500/20 transition active:scale-95 border border-red-500/10"><TrendingDown size={16} /></button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => handlePumpDump(1)} className="bg-green-600/10 text-green-500 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-green-600/20 transition active:scale-95 border border-green-600/20"><Zap size={14} /> Pump</button>
          <button onClick={() => handlePumpDump(-1)} className="bg-red-600/10 text-red-500 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-red-600/20 transition active:scale-95 border border-red-600/20"><Zap size={14} /> Dump</button>
          <button onClick={handleToggleFreeze} className={`col-span-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition active:scale-95 ${asset.isFrozen ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20'}`}>
            {asset.isFrozen ? <Play size={14} /> : <Pause size={14} />} 
            {asset.isFrozen ? 'Unfreeze Market' : 'Freeze Market'}
          </button>
        </div>

        {/* Exact Price & Target */}
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input 
              type="number" 
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder="Set Price"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:border-blue-500 outline-none transition"
            />
            <button onClick={handleSetPrice} className="absolute right-1 top-1 bottom-1 bg-blue-600 text-white px-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-500 transition">Set</button>
          </div>
          <div className="relative">
            <input 
              type="number" 
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Target"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:border-purple-500 outline-none transition"
            />
            <button onClick={handleSetTarget} className="absolute right-1 top-1 bottom-1 bg-purple-600 text-white px-2 rounded-lg text-[10px] font-black uppercase hover:bg-purple-500 transition"><Target size={14} /></button>
          </div>
        </div>

        {/* Volatility */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider">Volatility</label>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">{(asset.volatility * 100).toFixed(2)}%</span>
          </div>
          <input 
            type="range" 
            min="0.00001" 
            max="0.05" 
            step="0.0001"
            value={String(asset.volatility || 0)}
            onChange={(e) => handleSetVolatility(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[var(--bg-primary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Payout Control */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider">Market Payout</label>
            <span className="text-[10px] font-mono text-green-500 font-bold">{asset.payout || 90}%</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="range" 
              min="10" 
              max="100" 
              step="1"
              value={String(asset.payout || 90)}
              onChange={(e) => handleUpdatePayout(parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-[var(--bg-primary)] rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex gap-1">
              {[80, 90, 95].map(p => (
                <button 
                  key={p}
                  onClick={() => handleUpdatePayout(p)}
                  className="px-1.5 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[8px] font-bold text-[var(--text-secondary)] hover:text-green-500 transition"
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Win Percentage Control */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider">Win Percentage</label>
            <span className="text-[10px] font-mono text-purple-500 font-bold">{asset.winPercentage || 50}%</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="1"
              value={String(asset.winPercentage || 50)}
              onChange={(e) => handleUpdateWinPercentage(parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-[var(--bg-primary)] rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex gap-1">
              {[30, 50, 70].map(p => (
                <button 
                  key={p}
                  onClick={() => handleUpdateWinPercentage(p)}
                  className="px-1.5 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[8px] font-bold text-[var(--text-secondary)] hover:text-purple-500 transition"
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* User Edit Modal */}
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ socket, onBack, userEmail }) => {
  const [activeTrades, setActiveTrades] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [assets, setAssets] = useState<Record<string, any>>({});
  const [tab, setTab] = useState<'TRADES' | 'USERS' | 'MARKET' | 'AUTOMATION' | 'SUPPORT' | 'REQUESTS' | 'REFERRALS' | 'NOTIFICATIONS' | 'KYC' | 'REWARDS' | 'FINANCE' | 'DEPOSITS' | 'WITHDRAWALS'>('TRADES');
  const [stats, setStats] = useState({
    totalTrades: 0,
    totalVolume: 0,
    totalProfit: 0,
    totalLoss: 0,
    netPlatformProfit: 0,
    dailyStats: { trades: 0, volume: 0, profit: 0, loss: 0 }
  });
  const [tradeSettings, setTradeSettings] = useState({ mode: 'FAIR', winPercentage: 50, payoutPercentage: 90 });
  const [supportSettings, setSupportSettings] = useState({ telegram: '', whatsapp: '', email: '' });
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [selectedChatMessages, setSelectedChatMessages] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [adminInput, setAdminInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [platformSettings, setPlatformSettings] = useState({
    isTradingEnabled: true,
    isDepositsEnabled: true,
    isWithdrawalsEnabled: true,
    isChatEnabled: true,
    maintenanceMode: false
  });

  const adminQuickReplies = [
    "Hello! How can I help you today?",
    "Your deposit is being processed. Please wait 5-15 minutes.",
    "Please provide your transaction ID for verification.",
    "Your withdrawal request has been approved.",
    "Please complete your KYC verification to continue.",
    "Is there anything else I can assist you with?",
    "Thank you for contacting our support team!"
  ];

  useEffect(() => {
    // Listen to all chat sessions
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, orderBy('lastUpdated', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions: any[] = [];
      snapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });
      setChatSessions(sessions);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const messagesRef = collection(db, 'chats', selectedChat, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs: any[] = [];
        snapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() });
        });
        setSelectedChatMessages(msgs);
      });

      return () => unsubscribe();
    } else {
      setSelectedChatMessages([]);
    }
  }, [selectedChat]);

  const handleAdminSendMessage = async (text?: string) => {
    const messageText = text || adminInput;
    if (!messageText.trim() || !selectedChat) return;
    
    if (!text) setAdminInput('');

    try {
      const messagesRef = collection(db, 'chats', selectedChat, 'messages');
      await addDoc(messagesRef, {
        text: messageText,
        sender: 'admin',
        timestamp: serverTimestamp()
      });

      await setDoc(doc(db, 'chats', selectedChat), {
        lastMessage: messageText,
        lastUpdated: serverTimestamp(),
        status: 'active'
      }, { merge: true });
    } catch (error) {
      console.error("Error sending admin message:", error);
    }
  };

  const handleCloseChat = async (chatId: string) => {
    try {
      await setDoc(doc(db, 'chats', chatId), {
        status: 'closed',
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text: "This chat session has been closed by the support agent.",
        sender: 'system',
        timestamp: serverTimestamp()
      });
      
      if (selectedChat === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Error closing chat:", error);
    }
  };

  const handleUpdatePlatformSettings = (newSettings: any) => {
    const updated = { ...platformSettings, ...newSettings };
    setPlatformSettings(updated);
    if (socket) socket.emit('admin-update-platform-settings', updated);
  };

  const handleUpdateTradeSettings = (newSettings: any) => {
    const updated = { ...tradeSettings, ...newSettings };
    setTradeSettings(updated);
    if (socket) socket.emit('admin-update-trade-settings', updated);
  };
  const [depositSettings, setDepositSettings] = useState({
    bkashNumbers: ['01712-345678'],
    nagadNumbers: ['01712-345678'],
    rocketNumbers: ['01712-345678'],
    upayNumbers: ['01712-345678'],
    exchangeRate: 120,
    depositNote: 'Ensure you include your account ID in the reference if required. Deposits usually reflect within 5-15 minutes.',
    minDepositForBonus: 50,
    bonusPercentage: 10
  });
  const [referralSettings, setReferralSettings] = useState({ bonusAmount: 10, referralPercentage: 5, minDepositForBonus: 20 });
  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [newTutorial, setNewTutorial] = useState({ title: '', description: '', link: '', category: 'Beginner', duration: '' });
  const [newNotification, setNewNotification] = useState({ title: '', message: '', type: 'INFO' as 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER' });
  const [kycRequests, setKycRequests] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [newReward, setNewReward] = useState({ title: '', description: '', category: 'Promo Code', value: '', badge: '', icon: 'Gift' });
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('admin-join', userEmail);

    socket.on('admin-active-trades', (trades) => {
      setActiveTrades(trades);
    });

    socket.on('admin-users', (connectedUsers) => {
      setUsers(connectedUsers);
    });

    socket.on('admin-all-users', (data) => {
      setAllUsers(data);
    });

    socket.emit('admin-get-all-users');

    socket.on('admin-assets', (initialAssets) => {
      setAssets(initialAssets);
    });

    socket.on('admin-trade-settings', (settings) => {
      setTradeSettings(settings);
    });

    socket.on('admin-support-settings', (settings) => {
      setSupportSettings(settings);
    });

    socket.on('admin-tutorials', (data) => {
      setTutorials(data);
    });

    socket.on('admin-referral-settings', (settings) => {
      setReferralSettings(settings);
    });

    socket.on('admin-requests', (data) => {
      setRequests(data);
    });

    socket.on('admin-notifications', (data) => {
      setNotifications(data);
    });

    socket.on('admin-kyc-list', (data) => {
      setKycRequests(data);
    });

    socket.on('admin-rewards', (data) => {
      setRewards(data);
    });

    socket.on('admin-stats', (data) => {
      setStats(data);
    });

    socket.on('admin-platform-settings', (settings) => {
      setPlatformSettings(settings);
      setIsChatOpen(settings.isChatEnabled);
    });

    socket.on('admin-deposits', (data) => {
      setDeposits(data);
    });

    socket.on('admin-withdrawals', (data) => {
      setWithdrawals(data);
    });

    socket.on('market-tick', (ticks) => {
      setAssets(prev => {
        const updated = { ...prev };
        Object.keys(ticks).forEach(symbol => {
          if (updated[symbol]) {
            updated[symbol] = { ...updated[symbol], ...ticks[symbol] };
          }
        });
        return updated;
      });
    });

    socket.on('admin-deposit-settings', (settings) => {
      if (settings) setDepositSettings(settings);
    });

    return () => {
      socket.off('admin-active-trades');
      socket.off('admin-users');
      socket.off('admin-assets');
      socket.off('admin-trade-settings');
      socket.off('admin-support-settings');
      socket.off('admin-tutorials');
      socket.off('admin-referral-settings');
      socket.off('admin-requests');
      socket.off('admin-notifications');
      socket.off('admin-kyc-list');
      socket.off('admin-rewards');
      socket.off('admin-stats');
      socket.off('market-tick');
    };
  }, [socket, userEmail]);

  const handleUpdateSettings = (newSettings: any) => {
    if (socket) {
      socket.emit('admin-update-trade-settings', newSettings);
      setTradeSettings(prev => ({ ...prev, ...newSettings }));
    }
  };

  const handleForceTrade = (tradeId: string, result: 'WIN' | 'LOSS') => {
    if (socket) {
      socket.emit('admin-force-trade', { tradeId, result });
    }
  };

  const handleSetTrend = (asset: string, trend: number) => {
    if (socket) {
      socket.emit('admin-set-trend', { asset, trend });
      setAssets(prev => ({ ...prev, [asset]: { ...prev[asset], trend } }));
    }
  };

  const handleSetVolatility = (asset: string, volatility: number) => {
    if (socket) {
      socket.emit('admin-set-volatility', { asset, volatility });
      setAssets(prev => ({ ...prev, [asset]: { ...prev[asset], volatility } }));
    }
  };

  const handleUpdateRequestStatus = (requestId: string, status: 'APPROVED' | 'REJECTED', message: string = '') => {
    if (socket) {
      socket.emit('admin-update-request-status', { requestId, status, message });
    }
  };

  const handleSendNotification = () => {
    if (socket && newNotification.title && newNotification.message) {
      socket.emit('admin-send-notification', newNotification);
      setNewNotification({ title: '', message: '', type: 'INFO' });
    }
  };

  const handleUpdateReferralSettings = (settings: any) => {
    if (socket) {
      socket.emit('admin-update-referral-settings', settings);
    }
  };

  const handleUpdateKycStatus = (requestId: string, status: 'APPROVED' | 'REJECTED', message: string = '') => {
    if (socket) {
      socket.emit('admin-update-kyc-status', { id: requestId, status, reason: message });
    }
  };

  const handleAddReward = () => {
    if (socket && newReward.title && newReward.value) {
      socket.emit('admin-add-reward', newReward);
      setNewReward({ title: '', description: '', category: 'Promo Code', value: '', badge: '', icon: 'Gift' });
    }
  };

  const handleDeleteReward = (id: string) => {
    if (socket) {
      socket.emit('admin-delete-reward', id);
    }
  };

  const handleBoostUser = (email: string, isBoosted: boolean) => {
    if (socket) {
      socket.emit('admin-boost-user', { email, isBoosted });
    }
  };

  const handleUpdateUserBalance = (email: string, balance: number, type: 'REAL' | 'DEMO') => {
    if (socket) {
      socket.emit('admin-update-user-balance', { email, balance, type });
    }
  };

  const handleUpdateUserStatus = (email: string, status: 'ACTIVE' | 'BLOCKED') => {
    if (socket) {
      socket.emit('admin-update-user-status', { email, status });
    }
  };

  const handleDeleteUser = (email: string) => {
    if (window.confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
      if (socket) {
        socket.emit('admin-delete-user', email);
      }
    }
  };

  const handleSendNotificationToAll = () => {
    if (socket && newNotification.title && newNotification.message) {
      socket.emit('admin-send-notification-all', newNotification);
      setNewNotification({ title: '', message: '', type: 'INFO' });
      alert('Notification sent to all users!');
    }
  };

  const handleUpdateWithdrawStatus = (id: number, status: 'SUCCESS' | 'FAILED') => {
    if (socket) {
      socket.emit('admin-update-withdraw-status', { id, status });
    }
  };

  const handleUpdateDepositStatus = (id: number, status: 'SUCCESS' | 'FAILED') => {
    if (socket) {
      socket.emit('admin-update-deposit-status', { id, status });
    }
  };

  const adminEmails = ['hasan@gmail.com', 'tasmeaykhatun565@gmail.com'];
  if (!userEmail || !adminEmails.includes(userEmail.toLowerCase())) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-[var(--text-secondary)] mb-6">You do not have permission to view this page.</p>
          <button onClick={onBack} className="bg-[var(--bg-secondary)] px-6 py-2 rounded-lg">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans flex flex-col">
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-4 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-secondary)]/80">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/80 transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-red-500">Admin Panel</h1>
            <div className="text-[10px] text-[var(--text-secondary)] font-bold">ONYX OPTION v2.4</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] font-bold text-[var(--text-secondary)]">{userEmail}</span>
            <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">System Administrator</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col overflow-hidden">
        {/* Platform Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Activity size={14} />
              </div>
              <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Active Trades</span>
            </div>
            <div className="text-xl font-black text-[var(--text-primary)]">{activeTrades.length}</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                <Users size={14} />
              </div>
              <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Total Users</span>
            </div>
            <div className="text-xl font-black text-[var(--text-primary)]">{users.length}</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <ArrowUp size={14} />
              </div>
              <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Pending Req</span>
            </div>
            <div className="text-xl font-black text-[var(--text-primary)]">{requests.filter(r => r.status === 'PENDING').length}</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-color)] shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Zap size={14} />
              </div>
              <span className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Boosted</span>
            </div>
            <div className="text-xl font-black text-[var(--text-primary)]">{users.filter(u => u.isBoosted).length}</div>
          </div>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="flex bg-[var(--bg-secondary)] rounded-2xl p-1.5 mb-6 overflow-x-auto no-scrollbar shadow-inner border border-[var(--border-color)]">
          <div className="flex min-w-max gap-1">
          <button 
            onClick={() => setTab('TRADES')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'TRADES' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Activity size={14} /> Trades
          </button>
          <button 
            onClick={() => setTab('USERS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'USERS' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Users size={14} /> Users
          </button>
          <button 
            onClick={() => setTab('MARKET')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'MARKET' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Settings size={14} /> Market
          </button>
          <button 
            onClick={() => setTab('AUTOMATION')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'AUTOMATION' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Activity size={14} /> Controls
          </button>
          <button 
            onClick={() => setTab('REQUESTS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'REQUESTS' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <CreditCard size={14} /> Requests
          </button>
          <button 
            onClick={() => setTab('SUPPORT')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'SUPPORT' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <HelpCircle size={14} /> Support
          </button>
          <button 
            onClick={() => setTab('REFERRALS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'REFERRALS' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Gift size={14} /> Referrals
          </button>
          <button 
            onClick={() => {
              setTab('KYC');
              if (socket) socket.emit('admin-get-kyc-list');
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'KYC' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <ShieldCheck size={14} /> KYC
          </button>
          <button 
            onClick={() => setTab('REWARDS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'REWARDS' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Trophy size={14} /> Rewards
          </button>
          <button 
            onClick={() => setTab('DEPOSITS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'DEPOSITS' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Wallet size={14} /> Deposits
          </button>
          <button 
            onClick={() => setTab('WITHDRAWALS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'WITHDRAWALS' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <ArrowDown size={14} /> Withdrawals
          </button>
          <button 
            onClick={() => setTab('FINANCE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'FINANCE' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <BarChart2 size={14} /> Reports
          </button>
          <button 
            onClick={() => setTab('NOTIFICATIONS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${tab === 'NOTIFICATIONS' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <Bell size={14} /> Alerts
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'TRADES' && (
          <div className="space-y-4 pb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Active Trades
              </h2>
              <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-2 py-1 rounded-full border border-red-500/20">
                {activeTrades.length} ACTIVE
              </span>
            </div>
            
            {activeTrades.length === 0 ? (
              <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-4 text-[var(--text-secondary)]">
                  <Activity size={32} />
                </div>
                <h3 className="font-bold text-[var(--text-primary)]">No Active Trades</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Market is currently quiet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeTrades.map(trade => (
                  <div key={trade.id} className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-xl">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white ${trade.type === 'UP' ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'}`}>
                            {trade.type === 'UP' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[var(--text-primary)]">{trade.assetShortName}</div>
                            <div className="text-[10px] text-[var(--text-secondary)] font-mono">ID: {trade.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-[var(--text-primary)]">Đ{trade.amount}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">Investment</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 bg-[var(--bg-primary)] p-3 rounded-xl border border-[var(--border-color)]">
                        <div>
                          <div className="text-[10px] text-[var(--text-secondary)] uppercase font-bold mb-0.5">Entry Price</div>
                          <div className="text-xs font-mono text-[var(--text-secondary)]">{trade.entryPrice.toFixed(5)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-[var(--text-secondary)] uppercase font-bold mb-0.5">Time Left</div>
                          <div className="text-xs font-mono text-blue-500 font-bold">
                            {Math.max(0, Math.ceil((trade.endTime - Date.now()) / 1000))}s
                          </div>
                        </div>
                      </div>

                      {trade.forcedResult && (
                        <div className={`mb-4 py-2 rounded-lg text-center text-[10px] font-black uppercase tracking-widest border ${trade.forcedResult === 'WIN' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                          Auto-Control: {trade.forcedResult}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleForceTrade(trade.id, 'WIN')}
                          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 ${trade.forcedResult === 'WIN' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20'}`}
                        >
                          FORCE WIN
                        </button>
                        <button 
                          onClick={() => handleForceTrade(trade.id, 'LOSS')}
                          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 ${trade.forcedResult === 'LOSS' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'}`}
                        >
                          FORCE LOSS
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'USERS' && (
          <div className="space-y-4 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <div>
                <h2 className="text-lg font-bold">User Management</h2>
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Manage all registered accounts</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => socket?.emit('admin-get-all-users')}
                  className="p-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-blue-500 transition"
                >
                  <RefreshCw size={14} />
                </button>
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search by email or name..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500 transition shadow-sm"
                  />
                </div>
                <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-2 py-1 rounded-full border border-blue-500/20 whitespace-nowrap">
                  {allUsers.length} TOTAL
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {allUsers.filter(u => 
                u.email?.toLowerCase().includes(userSearch.toLowerCase()) || 
                u.name?.toLowerCase().includes(userSearch.toLowerCase())
              ).map(u => (
                <div key={u.email} className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                        {u.name ? u.name[0].toUpperCase() : u.email[0].toUpperCase()}
                      </div>
                      {users.find(cu => cu.email === u.email) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[var(--bg-secondary)] rounded-full" title="Online" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--text-primary)]">{u.name || 'Anonymous'}</span>
                        {u.isBoosted ? (
                          <div className="bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Zap size={8} fill="currentColor" /> BOOSTED
                          </div>
                        ) : null}
                        {u.status === 'BLOCKED' && (
                          <div className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <ShieldAlert size={8} /> BLOCKED
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] font-medium">{u.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-[var(--border-color)] pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <div className="text-sm font-black text-green-500">Đ{u.balance?.toLocaleString() || '0.00'}</div>
                      <div className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-tighter">Demo: Đ{u.demoBalance?.toLocaleString() || '0.00'}</div>
                    </div>
                    <div className="flex gap-1">
                       <button 
                        onClick={() => {
                          setSelectedUser(u);
                          setIsUserModalOpen(true);
                        }}
                        className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all active:scale-90 shadow-sm"
                        title="Edit User"
                      >
                        <Settings size={18} />
                      </button>
                       <button 
                        onClick={() => handleBoostUser(u.email, !u.isBoosted)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${u.isBoosted ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        title={u.isBoosted ? "Remove Boost" : "Apply Boost"}
                      >
                        <Zap size={18} fill={u.isBoosted ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u.email)}
                        className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'MARKET' && (
          <div className="space-y-4 pb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Market Manipulation</h2>
              <div className="flex gap-2">
                <button className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] p-2 rounded-xl hover:text-[var(--text-primary)] transition">
                  <Activity size={18} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(assets).map(symbol => (
                <AssetControl key={symbol} symbol={symbol} asset={assets[symbol]} socket={socket} />
              ))}
            </div>
          </div>
        )}

        {tab === 'AUTOMATION' && (
          <div className="space-y-6 pb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Platform Controls</h2>
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500">
                <Activity size={20} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Master Switches */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-xl">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-purple-500 mb-6">Master Switches</h3>
                <div className="space-y-4">
                  {[
                    { key: 'isTradingEnabled', label: 'Trading Engine', icon: <Activity size={18} />, color: 'blue' },
                    { key: 'isDepositsEnabled', label: 'Deposit System', icon: <ArrowUpCircle size={18} />, color: 'green' },
                    { key: 'isWithdrawalsEnabled', label: 'Withdrawal System', icon: <ArrowDownCircle size={18} />, color: 'red' },
                    { key: 'isChatEnabled', label: 'Support Chat', icon: <MessageSquare size={18} />, color: 'yellow' },
                    { key: 'maintenanceMode', label: 'Maintenance Mode', icon: <ShieldAlert size={18} />, color: 'orange' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          item.color === 'blue' && "bg-blue-500/10 text-blue-500",
                          item.color === 'green' && "bg-green-500/10 text-green-500",
                          item.color === 'red' && "bg-red-500/10 text-red-500",
                          item.color === 'yellow' && "bg-yellow-500/10 text-yellow-500",
                          item.color === 'orange' && "bg-orange-500/10 text-orange-500"
                        )}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[var(--text-primary)]">{item.label}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-medium">
                            {platformSettings[item.key as keyof typeof platformSettings] ? 'Operational' : 'Disabled'}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleUpdatePlatformSettings({ [item.key]: !platformSettings[item.key as keyof typeof platformSettings] })}
                        className={cn(
                          "w-12 h-6 rounded-full relative transition-colors",
                          platformSettings[item.key as keyof typeof platformSettings] ? "bg-green-500" : "bg-red-500"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          platformSettings[item.key as keyof typeof platformSettings] ? "right-1" : "left-1"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-xl">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-500 mb-6">Trade Result Control</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <button 
                    onClick={() => handleUpdateSettings({ mode: 'FAIR' })}
                    className={`group relative py-4 rounded-2xl font-black text-xs border transition-all active:scale-95 flex flex-col items-center gap-2 ${tradeSettings.mode === 'FAIR' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]/20'}`}
                  >
                    <Activity size={20} />
                    FAIR MARKET
                  </button>
                  <button 
                    onClick={() => handleUpdateSettings({ mode: 'FORCE_LOSS' })}
                    className={`group relative py-4 rounded-2xl font-black text-xs border transition-all active:scale-95 flex flex-col items-center gap-2 ${tradeSettings.mode === 'FORCE_LOSS' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]/20'}`}
                  >
                    <TrendingDown size={20} />
                    FORCE LOSS
                  </button>
                  <button 
                    onClick={() => handleUpdateSettings({ mode: 'FORCE_WIN' })}
                    className={`group relative py-4 rounded-2xl font-black text-xs border transition-all active:scale-95 flex flex-col items-center gap-2 ${tradeSettings.mode === 'FORCE_WIN' ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/20' : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]/20'}`}
                  >
                    <TrendingUp size={20} />
                    FORCE WIN
                  </button>
                  <button 
                    onClick={() => handleUpdateSettings({ mode: 'PERCENTAGE' })}
                    className={`group relative py-4 rounded-2xl font-black text-xs border transition-all active:scale-95 flex flex-col items-center gap-2 ${tradeSettings.mode === 'PERCENTAGE' ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20' : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]/20'}`}
                  >
                    <Percent size={20} />
                    PERCENTAGE
                  </button>
                </div>

                {tradeSettings.mode === 'PERCENTAGE' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--bg-primary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-inner"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">User Win Probability</label>
                      <span className="text-2xl font-black text-purple-500">{tradeSettings.winPercentage}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={tradeSettings.winPercentage}
                      onChange={(e) => handleUpdateSettings({ winPercentage: parseInt(e.target.value) })}
                      className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-purple-500 border border-[var(--border-color)]"
                    />
                    <p className="text-[9px] text-[var(--text-secondary)] text-center font-medium italic mt-4">
                      This will affect all users unless overridden by specific asset settings.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'SUPPORT' && (
          <div className="space-y-6 pb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Live Agent Chat</h2>
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500">
                <Send size={20} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Chat List */}
              <div className="bg-[var(--bg-secondary)] p-4 rounded-3xl border border-[var(--border-color)] shadow-xl h-[600px] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-green-500">Active Chats</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">Support:</span>
                    <button 
                      onClick={() => {
                        const newState = !isChatOpen;
                        setIsChatOpen(newState);
                        socket?.emit('admin-update-support-settings', { ...supportSettings, isChatEnabled: newState });
                      }}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-colors",
                        isChatOpen ? "bg-green-500" : "bg-red-500"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                        isChatOpen ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>
                </div>
                {chatSessions.filter(s => s.status !== 'closed').map(session => (
                  <div key={session.id} className="relative group mb-2">
                    <button 
                      onClick={() => setSelectedChat(session.id)}
                      className={`w-full p-4 rounded-2xl text-left transition-all ${selectedChat === session.id ? 'bg-green-500/10 border border-green-500/20' : 'bg-[var(--bg-primary)] border border-[var(--border-color)]'}`}
                    >
                      <div className="font-bold text-sm truncate pr-6">{session.email}</div>
                      <div className="text-[10px] text-[var(--text-secondary)] truncate">{session.lastMessage || 'Started chat'}</div>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseChat(session.id);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 rounded-lg"
                      title="Close Chat"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {chatSessions.filter(s => s.status === 'closed').length > 0 && (
                  <>
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mt-6 mb-4">Closed Chats</h3>
                    {chatSessions.filter(s => s.status === 'closed').map(session => (
                      <button 
                        key={session.id}
                        onClick={() => setSelectedChat(session.id)}
                        className={`w-full p-4 rounded-2xl text-left mb-2 transition-all opacity-60 ${selectedChat === session.id ? 'bg-[var(--bg-tertiary)] border border-[var(--border-color)]' : 'bg-[var(--bg-primary)]/50 border border-[var(--border-color)]'}`}
                      >
                        <div className="font-bold text-sm truncate">{session.email}</div>
                        <div className="text-[10px] text-[var(--text-secondary)]">Closed</div>
                      </button>
                    ))}
                  </>
                )}
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-2 bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-xl h-[600px] flex flex-col">
                {selectedChat ? (
                  <>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--border-color)]">
                      <div>
                        <div className="font-black text-sm text-[var(--text-primary)]">{selectedChat}</div>
                        <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Live Support Session</div>
                      </div>
                      <button 
                        onClick={() => handleCloseChat(selectedChat)}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition"
                      >
                        End Session
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 no-scrollbar">
                      {selectedChatMessages.map((msg, i) => (
                        <div key={msg.id || i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                          {msg.sender === 'system' ? (
                            <div className="text-[10px] font-bold text-[var(--text-secondary)] bg-[var(--bg-primary)] px-3 py-1 rounded-full border border-[var(--border-color)]">
                              {msg.text}
                            </div>
                          ) : (
                            <div className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${msg.sender === 'admin' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-tl-none'}`}>
                              <div className="text-sm leading-relaxed">{msg.text}</div>
                              <div className={`text-[8px] mt-1 font-bold uppercase opacity-50 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                                {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Admin Quick Replies */}
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {adminQuickReplies.map((reply, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleAdminSendMessage(reply)}
                          className="whitespace-nowrap bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-green-500/50 text-[10px] font-bold px-3 py-2 rounded-xl transition-all active:scale-95"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={adminInput}
                        onChange={(e) => setAdminInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdminSendMessage()}
                        className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-sm outline-none focus:border-green-500 transition shadow-inner"
                        placeholder="Type a professional reply..."
                      />
                      <button 
                        onClick={() => handleAdminSendMessage()}
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center gap-2"
                      >
                        <Send size={16} /> Send
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-secondary)] text-center">
                    <div className="w-20 h-20 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mb-4 border border-[var(--border-color)]">
                      <MessageSquare size={32} className="opacity-20" />
                    </div>
                    <h4 className="font-bold text-[var(--text-primary)]">No Chat Selected</h4>
                    <p className="text-xs max-w-[200px] mt-2">Select an active conversation from the list to start replying.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Support Channels</h2>
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                <HelpCircle size={20} />
              </div>
            </div>
              {/* Support Links */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-xl space-y-6">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-500">Support Channels</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase ml-1">Telegram Link</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400"><Send size={16} /></div>
                      <input 
                        type="text" 
                        value={supportSettings.telegram}
                        onChange={(e) => setSupportSettings(prev => ({ ...prev, telegram: e.target.value }))}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl pl-12 pr-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500 outline-none transition shadow-inner"
                        placeholder="https://t.me/your_support"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase ml-1">WhatsApp Link</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"><Phone size={16} /></div>
                      <input 
                        type="text" 
                        value={supportSettings.whatsapp}
                        onChange={(e) => setSupportSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl pl-12 pr-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500 outline-none transition shadow-inner"
                        placeholder="https://wa.me/1234567890"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase ml-1">Support Email</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"><Mail size={16} /></div>
                      <input 
                        type="email" 
                        value={supportSettings.email}
                        onChange={(e) => setSupportSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl pl-12 pr-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500 outline-none transition shadow-inner"
                        placeholder="support@yourdomain.com"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => socket?.emit('admin-update-support-settings', supportSettings)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-2 text-xs uppercase tracking-widest"
                  >
                    Update Channels
                  </button>
                </div>
              </div>

              {/* YouTube Tutorials */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-xl space-y-6">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-red-500">YouTube Tutorials</h3>
                
                <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-inner">
                  <div className="grid grid-cols-1 gap-3">
                    <input 
                      type="text" 
                      placeholder="Video Title"
                      value={newTutorial.title}
                      onChange={(e) => setNewTutorial(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-red-500/50 transition"
                    />
                    <textarea 
                      placeholder="Short Description"
                      value={newTutorial.description}
                      onChange={(e) => setNewTutorial(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none h-20 focus:border-red-500/50 transition resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="YouTube URL"
                        value={newTutorial.link}
                        onChange={(e) => setNewTutorial(prev => ({ ...prev, link: e.target.value }))}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-red-500/50 transition"
                      />
                      <input 
                        type="text" 
                        placeholder="Duration"
                        value={newTutorial.duration}
                        onChange={(e) => setNewTutorial(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-red-500/50 transition"
                      />
                    </div>
                    <select 
                      value={newTutorial.category}
                      onChange={(e) => setNewTutorial(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-red-500/50 transition"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      if (!newTutorial.title || !newTutorial.link) return;
                      const updated = [...tutorials, { ...newTutorial, id: Date.now().toString() }];
                      setTutorials(updated);
                      socket?.emit('admin-update-tutorials', updated);
                      setNewTutorial({ title: '', description: '', link: '', category: 'Beginner', duration: '' });
                    }}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95 text-xs uppercase tracking-widest"
                  >
                    Add Tutorial
                  </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                  {tutorials.map((t, idx) => (
                    <div key={t.id} className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--border-color)] flex flex-col gap-2 group hover:border-red-500/20 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                            <Video size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[var(--text-primary)]">{t.title}</div>
                            <div className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{t.category} • {t.duration}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const updated = tutorials.filter((_, i) => i !== idx);
                            setTutorials(updated);
                            socket?.emit('admin-update-tutorials', updated);
                          }}
                          className="text-[var(--text-secondary)] hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 ml-1">{t.description}</p>
                      <div className="text-[9px] text-blue-400 truncate ml-1 font-mono">{t.link}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        {tab === 'REQUESTS' && (
          <div className="space-y-4 pb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Transaction Requests</h2>
              <span className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-2 py-1 rounded-full border border-orange-500/20">
                {requests.filter(r => r.status === 'PENDING').length} PENDING
              </span>
            </div>
            
            {requests.length === 0 ? (
              <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6 text-[var(--text-secondary)]">
                  <CreditCard size={40} />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">No Requests Found</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2">All transactions have been processed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.slice().reverse().map(req => (
                  <div key={req.id} className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-xl flex flex-col">
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${req.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                            {req.type === 'DEPOSIT' ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${req.type === 'DEPOSIT' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                                {req.type}
                              </span>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : req.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                {req.status}
                              </span>
                            </div>
                            <div className="text-xl font-black text-[var(--text-primary)] mt-1">Đ{req.amount.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-[var(--text-secondary)] font-bold">{new Date(req.timestamp).toLocaleDateString()}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-mono">{new Date(req.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                      
                      <div className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--border-color)] space-y-2 mb-4 shadow-inner">
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--text-secondary)] font-bold uppercase tracking-tighter">User</span>
                          <span className="text-[var(--text-primary)] font-medium">{req.userEmail}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[var(--text-secondary)] font-bold uppercase tracking-tighter">Method</span>
                          <span className="text-blue-400 font-black">{req.method}</span>
                        </div>
                        {req.details && (
                          <div className="pt-2 border-t border-[var(--border-color)]">
                            <div className="text-[10px] text-[var(--text-secondary)] font-bold uppercase mb-1">Details / Transaction ID</div>
                            <div className="text-xs text-[var(--text-primary)] break-all font-mono bg-[var(--bg-secondary)] p-2 rounded-lg">{req.details}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="p-4 bg-[var(--bg-primary)]/50 border-t border-[var(--border-color)] flex gap-2">
                        <button 
                          onClick={() => handleUpdateRequestStatus(req.id, 'APPROVED')}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Check size={16} strokeWidth={3} /> Approve
                        </button>
                        <button 
                          onClick={() => {
                            const msg = prompt('Reason for rejection?');
                            if (msg !== null) handleUpdateRequestStatus(req.id, 'REJECTED', msg);
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <X size={16} strokeWidth={3} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'REFERRALS' && (
          <div className="space-y-6 pb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Referral Program</h2>
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-500">
                <Gift size={20} />
              </div>
            </div>
            
            <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl border border-[var(--border-color)] shadow-2xl max-w-2xl mx-auto">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 mb-4 shadow-inner">
                  <Trophy size={40} />
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)]">Reward Configuration</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2">Configure how users are rewarded for inviting others.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Fixed Bonus (Đ)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-black">Đ</div>
                    <input 
                      type="number" 
                      value={referralSettings.bonusAmount}
                      onChange={(e) => setReferralSettings(prev => ({ ...prev, bonusAmount: parseFloat(e.target.value) }))}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl pl-10 pr-4 py-4 text-lg font-black text-[var(--text-primary)] outline-none focus:border-yellow-500 transition shadow-inner"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Commission (%)</label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 font-black">%</div>
                    <input 
                      type="number" 
                      value={referralSettings.referralPercentage}
                      onChange={(e) => setReferralSettings(prev => ({ ...prev, referralPercentage: parseFloat(e.target.value) }))}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-4 py-4 text-lg font-black text-[var(--text-primary)] outline-none focus:border-yellow-500 transition shadow-inner"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Minimum Deposit Required (Đ)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-black"><Target size={18} /></div>
                    <input 
                      type="number" 
                      value={referralSettings.minDepositForBonus}
                      onChange={(e) => setReferralSettings(prev => ({ ...prev, minDepositForBonus: parseFloat(e.target.value) }))}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl pl-12 pr-4 py-4 text-lg font-black text-[var(--text-primary)] outline-none focus:border-yellow-500 transition shadow-inner"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleUpdateReferralSettings(referralSettings)}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-5 rounded-2xl transition-all shadow-lg shadow-yellow-500/20 active:scale-95 text-sm uppercase tracking-[0.2em]"
              >
                Update Referral Policy
              </button>
            </div>
          </div>
        )}

        {tab === 'KYC' && (
          <div className="space-y-4 pb-10">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">KYC Verification Requests</h2>
                <button 
                  onClick={() => socket?.emit('admin-get-kyc-list')}
                  className="p-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-blue-500 transition"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-2 py-1 rounded-full border border-blue-500/20">
                {kycRequests.filter(r => r.status === 'PENDING').length} PENDING
              </span>
            </div>
            
            {kycRequests.length === 0 ? (
              <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mb-6 text-[var(--text-secondary)]">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">No KYC Requests</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2">All identity verifications are up to date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {kycRequests.map(req => (
                  <div key={req.id} className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-xl flex flex-col">
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-lg">
                            <User size={28} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest bg-blue-600 text-white shadow-sm">
                                {req.documentType}
                              </span>
                              <span className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border",
                                req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                                req.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                'bg-red-500/10 text-red-500 border-red-500/20'
                              )}>
                                {req.status}
                              </span>
                            </div>
                            <div className="text-lg font-black text-[var(--text-primary)] mt-1">{req.fullName}</div>
                            <div className="text-xs text-[var(--text-secondary)] font-bold">{req.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">Submitted At</div>
                          <div className="text-xs text-[var(--text-primary)] font-bold">{new Date(req.submittedAt).toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] space-y-4 shadow-inner">
                            <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest border-b border-[var(--border-color)] pb-2">User Details</h4>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Doc Number</span>
                              <span className="text-xs text-[var(--text-primary)] font-black">{req.documentNumber}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Birth Date</span>
                              <span className="text-xs text-[var(--text-primary)] font-black">{req.dateOfBirth}</span>
                            </div>
                            {req.rejectionReason && (
                              <div className="pt-2">
                                <span className="text-[10px] text-red-500 font-bold uppercase">Rejection Reason</span>
                                <p className="text-xs text-red-400 mt-1 bg-red-500/5 p-2 rounded-lg border border-red-500/10">{req.rejectionReason}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest ml-1">Front Side</div>
                            <div className="aspect-[3/2] rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] overflow-hidden relative group shadow-inner">
                              {req.frontImage ? (
                                <img 
                                  src={req.frontImage} 
                                  alt="Front Side" 
                                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => window.open(req.frontImage, '_blank')}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                                  <FileText size={32} className="opacity-20" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest ml-1">Back Side</div>
                            <div className="aspect-[3/2] rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] overflow-hidden relative group shadow-inner">
                              {req.backImage ? (
                                <img 
                                  src={req.backImage} 
                                  alt="Back Side" 
                                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                  onClick={() => window.open(req.backImage, '_blank')}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                                  <FileText size={32} className="opacity-20" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="p-4 bg-[var(--bg-primary)]/50 border-t border-[var(--border-color)] flex gap-3">
                        <button 
                          onClick={() => handleUpdateKycStatus(req.id, 'APPROVED')}
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <Check size={18} strokeWidth={3} /> Approve Identity
                        </button>
                        <button 
                          onClick={() => {
                            const msg = prompt('Reason for rejection?');
                            if (msg !== null) handleUpdateKycStatus(req.id, 'REJECTED', msg);
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <X size={18} strokeWidth={3} /> Reject Request
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'REWARDS' && (
          <div className="space-y-6 pb-10">
            <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Plus size={20} className="text-blue-500" /> Create New Reward
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Title</label>
                  <input 
                    type="text" 
                    value={newReward.title}
                    onChange={(e) => setNewReward({...newReward, title: e.target.value})}
                    placeholder="e.g. 100% Deposit Bonus"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Category</label>
                  <select 
                    value={newReward.category}
                    onChange={(e) => setNewReward({...newReward, category: e.target.value})}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  >
                    <option>Promo Code</option>
                    <option>Cashback</option>
                    <option>Bonus</option>
                    <option>Tournament</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Value / Code</label>
                  <input 
                    type="text" 
                    value={newReward.value}
                    onChange={(e) => setNewReward({...newReward, value: e.target.value})}
                    placeholder="e.g. SAVE100"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Badge (e.g. 110%)</label>
                  <input 
                    type="text" 
                    value={newReward.badge}
                    onChange={(e) => setNewReward({...newReward, badge: e.target.value})}
                    placeholder="e.g. 110%"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Description</label>
                  <textarea 
                    value={newReward.description}
                    onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                    placeholder="Describe the reward and how to get it..."
                    rows={2}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition resize-none"
                  />
                </div>
              </div>
              <button 
                onClick={handleAddReward}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Publish Reward
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map(reward => (
                <div key={reward.id} className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-5 shadow-xl relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <Gift size={20} />
                    </div>
                    <button 
                      onClick={() => handleDeleteReward(reward.id)}
                      className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest bg-blue-500 text-white">
                        {reward.category}
                      </span>
                      {reward.badge && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">
                          {reward.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-[var(--text-primary)]">{reward.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{reward.description}</p>
                  </div>
                  <div className="bg-[var(--bg-primary)] rounded-xl p-3 border border-[var(--border-color)] flex justify-between items-center">
                    <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Value:</span>
                    <span className="text-xs font-black text-blue-500">{reward.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'DEPOSITS' && (
          <div className="space-y-6 pb-10">
            <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Wallet size={20} className="text-blue-500" /> Deposit Settings
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">bKash Numbers</h4>
                  {depositSettings.bkashNumbers.map((num, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        value={num}
                        onChange={(e) => {
                          const newNums = [...depositSettings.bkashNumbers];
                          newNums[idx] = e.target.value;
                          setDepositSettings(prev => ({ ...prev, bkashNumbers: newNums }));
                        }}
                        className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                      />
                      <button 
                        onClick={() => {
                          const newNums = depositSettings.bkashNumbers.filter((_, i) => i !== idx);
                          setDepositSettings(prev => ({ ...prev, bkashNumbers: newNums }));
                        }}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDepositSettings(prev => ({ ...prev, bkashNumbers: [...prev.bkashNumbers, ''] }))}
                    className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add bKash Number
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Nagad Numbers</h4>
                  {depositSettings.nagadNumbers.map((num, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        value={num}
                        onChange={(e) => {
                          const newNums = [...depositSettings.nagadNumbers];
                          newNums[idx] = e.target.value;
                          setDepositSettings(prev => ({ ...prev, nagadNumbers: newNums }));
                        }}
                        className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                      />
                      <button 
                        onClick={() => {
                          const newNums = depositSettings.nagadNumbers.filter((_, i) => i !== idx);
                          setDepositSettings(prev => ({ ...prev, nagadNumbers: newNums }));
                        }}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDepositSettings(prev => ({ ...prev, nagadNumbers: [...prev.nagadNumbers, ''] }))}
                    className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Nagad Number
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Rocket Numbers</h4>
                  {depositSettings.rocketNumbers?.map((num, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        value={num}
                        onChange={(e) => {
                          const newNums = [...(depositSettings.rocketNumbers || [])];
                          newNums[idx] = e.target.value;
                          setDepositSettings(prev => ({ ...prev, rocketNumbers: newNums }));
                        }}
                        className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                      />
                      <button 
                        onClick={() => {
                          const newNums = (depositSettings.rocketNumbers || []).filter((_, i) => i !== idx);
                          setDepositSettings(prev => ({ ...prev, rocketNumbers: newNums }));
                        }}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDepositSettings(prev => ({ ...prev, rocketNumbers: [...(prev.rocketNumbers || []), ''] }))}
                    className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Rocket Number
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Upay Numbers</h4>
                  {depositSettings.upayNumbers?.map((num, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        value={num}
                        onChange={(e) => {
                          const newNums = [...(depositSettings.upayNumbers || [])];
                          newNums[idx] = e.target.value;
                          setDepositSettings(prev => ({ ...prev, upayNumbers: newNums }));
                        }}
                        className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                      />
                      <button 
                        onClick={() => {
                          const newNums = (depositSettings.upayNumbers || []).filter((_, i) => i !== idx);
                          setDepositSettings(prev => ({ ...prev, upayNumbers: newNums }));
                        }}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDepositSettings(prev => ({ ...prev, upayNumbers: [...(prev.upayNumbers || []), ''] }))}
                    className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Upay Number
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Exchange Rate (1 USD = ? BDT)</label>
                  <input 
                    type="number" 
                    value={depositSettings.exchangeRate || 120}
                    onChange={(e) => setDepositSettings(prev => ({ ...prev, exchangeRate: parseFloat(e.target.value) }))}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Deposit Note / Instructions</label>
                  <textarea 
                    value={depositSettings.depositNote}
                    onChange={(e) => setDepositSettings(prev => ({ ...prev, depositNote: e.target.value }))}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Min Deposit for Bonus (USD)</label>
                    <input 
                      type="number" 
                      value={depositSettings.minDepositForBonus || 50}
                      onChange={(e) => setDepositSettings(prev => ({ ...prev, minDepositForBonus: parseFloat(e.target.value) }))}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Bonus Percentage (%)</label>
                    <input 
                      type="number" 
                      value={depositSettings.bonusPercentage || 10}
                      onChange={(e) => setDepositSettings(prev => ({ ...prev, bonusPercentage: parseFloat(e.target.value) }))}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (socket) {
                      socket.emit('admin-update-deposit-settings', depositSettings);
                      alert('Deposit settings updated successfully!');
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition shadow-lg shadow-blue-600/20 uppercase tracking-widest text-xs"
                >
                  Save Deposit Settings
                </button>
              </div>
            </div>

            {/* Deposits and Withdrawals Tables */}
            <div className="space-y-6 mt-8">
              <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-xl">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6">Deposit Requests</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Method</th>
                        <th className="pb-3 font-medium">Transaction ID</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {deposits.map((deposit) => (
                        <tr key={deposit.id} className="text-[var(--text-primary)]">
                          <td className="py-4">{deposit.email}</td>
                          <td className="py-4 font-bold">{deposit.currency} {deposit.amount}</td>
                          <td className="py-4">{deposit.method}</td>
                          <td className="py-4 font-mono text-xs">{deposit.transactionId}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                              deposit.status === 'SUCCESS' ? 'bg-green-500/20 text-green-500' :
                              deposit.status === 'FAILED' ? 'bg-red-500/20 text-red-500' :
                              'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {deposit.status}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-[var(--text-secondary)]">
                            {new Date(deposit.submittedAt).toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            {deposit.status === 'PENDING' && (
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleUpdateDepositStatus(deposit.id, 'SUCCESS')}
                                  className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleUpdateDepositStatus(deposit.id, 'FAILED')}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {deposits.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[var(--text-secondary)]">No deposit requests found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-xl">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6">Withdrawal Requests</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                        <th className="pb-3 font-medium">Email</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Method</th>
                        <th className="pb-3 font-medium">Account Details</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {withdrawals.map((withdraw) => (
                        <tr key={withdraw.id} className="text-[var(--text-primary)]">
                          <td className="py-4">{withdraw.email}</td>
                          <td className="py-4 font-bold">{withdraw.currency} {withdraw.amount}</td>
                          <td className="py-4">{withdraw.method}</td>
                          <td className="py-4 font-mono text-xs">{withdraw.accountDetails}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                              withdraw.status === 'SUCCESS' ? 'bg-green-500/20 text-green-500' :
                              withdraw.status === 'FAILED' ? 'bg-red-500/20 text-red-500' :
                              'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {withdraw.status}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-[var(--text-secondary)]">
                            {new Date(withdraw.submittedAt).toLocaleString()}
                          </td>
                          <td className="py-4 text-right">
                            {withdraw.status === 'PENDING' && (
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleUpdateWithdrawStatus(withdraw.id, 'SUCCESS')}
                                  className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleUpdateWithdrawStatus(withdraw.id, 'FAILED')}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {withdrawals.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[var(--text-secondary)]">No withdrawal requests found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'FINANCE' && (
          <div className="space-y-6 pb-10">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500">
                  <BarChart2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Live Account Professional Audit</h2>
                  <p className="text-[9px] text-[var(--text-secondary)] uppercase font-black tracking-widest">Daily Calculation & Market Control</p>
                </div>
              </div>
              <button 
                onClick={() => socket?.emit('admin-reset-daily-stats')}
                className="bg-red-500/10 text-red-500 text-[10px] font-black px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition flex items-center gap-2"
              >
                <Trash2 size={12} /> RESET DAILY
              </button>
            </div>

            <div className="space-y-6">
              {/* Daily Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-secondary)] p-5 rounded-3xl border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><ArrowUp size={40} /></div>
                  <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Live Volume</div>
                  <div className="text-2xl font-black text-[var(--text-primary)]">Đ{stats.dailyStats.volume.toLocaleString()}</div>
                  <div className="text-[10px] text-blue-500 font-bold mt-1">{stats.dailyStats.trades} Live Entries Today</div>
                </div>
                <div className="bg-[var(--bg-secondary)] p-5 rounded-3xl border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform text-red-500"><TrendingUp size={40} /></div>
                  <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">User Payouts</div>
                  <div className="text-2xl font-black text-red-500">Đ{stats.dailyStats.profit.toLocaleString()}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] font-bold mt-1">Platform Expense (Wins)</div>
                </div>
                <div className="bg-[var(--bg-secondary)] p-5 rounded-3xl border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform text-green-500"><TrendingDown size={40} /></div>
                  <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">User Losses</div>
                  <div className="text-2xl font-black text-green-500">Đ{stats.dailyStats.loss.toLocaleString()}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] font-bold mt-1">Platform Revenue (Losses)</div>
                </div>
                <div className="bg-[var(--bg-secondary)] p-5 rounded-3xl border border-[var(--border-color)] shadow-xl border-blue-500/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform text-blue-500"><Target size={40} /></div>
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Daily Net Profit</div>
                  <div className={`text-2xl font-black ${(stats.dailyStats.loss - stats.dailyStats.profit) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    Đ{(stats.dailyStats.loss - stats.dailyStats.profit).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] font-bold mt-1">Professional House Edge</div>
                </div>
              </div>

              {/* Market Percentage Control Section */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">Global Market Percentage Control</h3>
                  <span className="text-[9px] font-black bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20">AUTO-SYNC ENABLED</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Adjust the global payout percentage to control platform profitability. A lower percentage increases the house edge, while a higher percentage attracts more traders.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500" 
                          style={{ width: `${tradeSettings.payoutPercentage}%` }} 
                        />
                      </div>
                      <span className="text-xl font-black text-[var(--text-primary)]">{tradeSettings.payoutPercentage}%</span>
                    </div>
                    <div className="flex gap-2">
                      {[80, 85, 90, 92, 95].map(p => (
                        <button 
                          key={p}
                          onClick={() => handleUpdateTradeSettings({ payoutPercentage: p })}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${tradeSettings.payoutPercentage === p ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-blue-500/30'}`}
                        >
                          {p}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] flex flex-col justify-center text-center">
                    <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2">Recommended Payout</div>
                    <div className="text-4xl font-black text-blue-500 mb-1">
                      {stats.dailyStats.loss > stats.dailyStats.profit ? '92%' : '85%'}
                    </div>
                    <p className="text-[9px] text-[var(--text-secondary)] font-bold italic">
                      Based on today's Live Balance performance
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Calculation Table */}
              <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-xl">
                <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/30 flex items-center justify-between">
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-[var(--text-primary)]">Detailed Live Accounting Statement</h3>
                  <div className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Date: {new Date().toLocaleDateString()}</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--bg-primary)] text-[var(--text-secondary)] font-black uppercase tracking-tighter">
                      <tr>
                        <th className="px-6 py-4">Accounting Metric</th>
                        <th className="px-6 py-4">Live Value</th>
                        <th className="px-6 py-4">Classification</th>
                        <th className="px-6 py-4">Analysis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      <tr>
                        <td className="px-6 py-4 font-bold">Total Live Entries</td>
                        <td className="px-6 py-4 font-mono text-lg">{stats.totalTrades}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[9px] font-black">OPERATIONAL</span></td>
                        <td className="px-6 py-4 text-[var(--text-secondary)] font-bold">Active market participation</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold">Total Capital Staked</td>
                        <td className="px-6 py-4 font-mono text-lg text-blue-500">Đ{stats.totalVolume.toLocaleString()}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[9px] font-black">GROSS VOLUME</span></td>
                        <td className="px-6 py-4 text-[var(--text-secondary)] font-bold">Total risk exposure</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold">Total User Payouts</td>
                        <td className="px-6 py-4 font-mono text-lg text-red-500">Đ{stats.totalProfit.toLocaleString()}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-[9px] font-black">PLATFORM EXPENSE</span></td>
                        <td className="px-6 py-4 text-[var(--text-secondary)] font-bold">Capital returned to winners</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold">Total User Losses</td>
                        <td className="px-6 py-4 font-mono text-lg text-green-500">Đ{stats.totalLoss.toLocaleString()}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[9px] font-black">PLATFORM REVENUE</span></td>
                        <td className="px-6 py-4 text-[var(--text-secondary)] font-bold">Retained capital from losses</td>
                      </tr>
                      <tr className="bg-blue-500/5">
                        <td className="px-6 py-4 font-black uppercase text-sm">Net Platform Profit</td>
                        <td className={`px-6 py-4 font-mono text-2xl font-black ${stats.netPlatformProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          Đ{stats.netPlatformProfit.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black ${stats.netPlatformProfit >= 0 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}>
                            {stats.netPlatformProfit >= 0 ? 'NET SURPLUS' : 'NET DEFICIT'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[var(--text-primary)]">
                              Margin: {((stats.netPlatformProfit / (stats.totalVolume || 1)) * 100).toFixed(2)}%
                            </span>
                            <span className="text-[9px] text-[var(--text-secondary)] font-bold">Professional House Edge</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lifetime Summary */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-xl">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6">Platform Lifetime Performance (Live Balance)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-secondary)]">
                      <span>Total Volume</span>
                      <span className="text-[var(--text-primary)]">Đ{stats.totalVolume.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-secondary)]">
                      <span>User Profit Rate</span>
                      <span className="text-red-500">{((stats.totalProfit / (stats.totalVolume || 1)) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${(stats.totalProfit / (stats.totalVolume || 1)) * 100}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-secondary)]">
                      <span>Platform Margin</span>
                      <span className="text-green-500">{((stats.netPlatformProfit / (stats.totalVolume || 1)) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${(stats.netPlatformProfit / (stats.totalVolume || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'WITHDRAWALS' && (
          <div className="space-y-6 pb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Withdrawal Requests</h2>
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500">
                <ArrowDown size={20} />
              </div>
            </div>

            <div className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-color)] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[var(--text-secondary)]">
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Method</th>
                      <th className="pb-3 font-medium">Account Details</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {withdrawals.map((withdraw) => (
                      <tr key={withdraw.id} className="text-[var(--text-primary)]">
                        <td className="py-4">{withdraw.email}</td>
                        <td className="py-4 font-bold">{withdraw.currency} {withdraw.amount}</td>
                        <td className="py-4">{withdraw.method}</td>
                        <td className="py-4 font-mono text-xs max-w-[200px] truncate" title={withdraw.accountDetails}>{withdraw.accountDetails}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            withdraw.status === 'SUCCESS' ? 'bg-green-500/20 text-green-500' :
                            withdraw.status === 'FAILED' ? 'bg-red-500/20 text-red-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {withdraw.status}
                          </span>
                        </td>
                        <td className="py-4 text-[10px] text-[var(--text-secondary)]">
                          {new Date(withdraw.submittedAt).toLocaleString()}
                        </td>
                        <td className="py-4 text-right">
                          {withdraw.status === 'PENDING' && (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleUpdateWithdrawStatus(withdraw.id, 'SUCCESS')}
                                className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition"
                                title="Approve"
                              >
                                <Check size={14} />
                              </button>
                              <button 
                                onClick={() => handleUpdateWithdrawStatus(withdraw.id, 'FAILED')}
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
                                title="Reject"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {withdrawals.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-[var(--text-secondary)]">No withdrawal requests found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'NOTIFICATIONS' && (
          <div className="space-y-6 pb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">System Alerts</h2>
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                <Bell size={20} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl border border-[var(--border-color)] shadow-xl space-y-6">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">Broadcast New Alert</h3>
                
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Alert Headline"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-blue-500 transition shadow-inner"
                  />
                  <textarea 
                    placeholder="Detailed message for all users..."
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-sm text-[var(--text-primary)] outline-none h-32 resize-none focus:border-blue-500 transition shadow-inner"
                  />
                  <div className="flex gap-2">
                    {(['INFO', 'SUCCESS', 'WARNING', 'DANGER'] as const).map(type => (
                      <button 
                        key={type}
                        onClick={() => setNewNotification(prev => ({ ...prev, type }))}
                        className={`flex-1 py-3 rounded-xl text-[9px] font-black transition-all border uppercase tracking-widest ${newNotification.type === type ? 'bg-white text-black border-white shadow-lg' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]/20'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={handleSendNotification}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 mt-2 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]"
                  >
                    <Send size={18} /> Broadcast to All
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] ml-2">Broadcast History</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] p-12 text-center">
                      <p className="text-[var(--text-secondary)] text-sm font-bold">No history available.</p>
                    </div>
                  ) : (
                    notifications.slice().reverse().map(n => (
                      <div key={n.id} className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-lg group hover:border-[var(--border-color)] transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${n.type === 'DANGER' ? 'bg-red-500' : n.type === 'WARNING' ? 'bg-yellow-500' : n.type === 'SUCCESS' ? 'bg-green-500' : 'bg-blue-500'}`} />
                            <span className="font-black text-sm text-[var(--text-primary)]">{n.title}</span>
                          </div>
                          <span className="text-[9px] text-[var(--text-secondary)] font-bold">{new Date(n.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{n.message}</p>
                        <div className="mt-3 pt-3 border-t border-[var(--border-color)] flex justify-between items-center">
                           <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${n.type === 'DANGER' ? 'bg-red-500/10 text-red-500' : n.type === 'WARNING' ? 'bg-yellow-500/10 text-yellow-500' : n.type === 'SUCCESS' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {n.type}
                          </span>
                          <span className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">{new Date(n.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Edit Modal */}
        <AnimatePresence>
          {isUserModalOpen && selectedUser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsUserModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {selectedUser.name ? selectedUser.name[0].toUpperCase() : selectedUser.email[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-[var(--text-primary)]">{selectedUser.name || 'Anonymous'}</h3>
                      <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsUserModalOpen(false)}
                    className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                  {/* Balance Controls */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Balance Management</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Real Balance (Đ)</label>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            defaultValue={selectedUser.balance}
                            onBlur={(e) => handleUpdateUserBalance(selectedUser.email, parseFloat(e.target.value), 'REAL')}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm font-bold focus:border-blue-500 outline-none transition"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Demo Balance (Đ)</label>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            defaultValue={selectedUser.demoBalance}
                            onBlur={(e) => handleUpdateUserBalance(selectedUser.email, parseFloat(e.target.value), 'DEMO')}
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm font-bold focus:border-blue-500 outline-none transition"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Controls */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Account Status</h4>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleUpdateUserStatus(selectedUser.email, 'ACTIVE')}
                        className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedUser.status === 'ACTIVE' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}
                      >
                        Active
                      </button>
                      <button 
                        onClick={() => handleUpdateUserStatus(selectedUser.email, 'BLOCKED')}
                        className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedUser.status === 'BLOCKED' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                      >
                        Blocked
                      </button>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">Account Info</h4>
                    <div className="bg-[var(--bg-primary)] rounded-2xl p-4 space-y-3 border border-[var(--border-color)]">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">KYC Status</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          selectedUser.kycStatus === 'APPROVED' ? 'bg-green-500/20 text-green-500' :
                          selectedUser.kycStatus === 'REJECTED' ? 'bg-red-500/20 text-red-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {selectedUser.kycStatus || 'NONE'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Joined On</span>
                        <span className="text-[10px] font-mono text-[var(--text-primary)]">
                          {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Last Login</span>
                        <span className="text-[10px] font-mono text-[var(--text-primary)]">
                          {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[var(--bg-tertiary)] flex gap-3">
                  <button 
                    onClick={() => setIsUserModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      handleDeleteUser(selectedUser.email);
                      setIsUserModalOpen(false);
                    }}
                    className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/20"
                  >
                    Delete User
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);
};
