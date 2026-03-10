import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  BarChart2, 
  Shield, 
  Zap, 
  Globe, 
  Smartphone, 
  Users, 
  Trophy,
  CheckCircle2,
  TrendingUp,
  Clock,
  Wallet,
  ChevronDown,
  ChevronUp,
  Star,
  Play,
  Download,
  Lock,
  CreditCard,
  HeadphonesIcon,
  ChevronRight,
  Activity,
  AlertTriangle,
  FileText,
  Building,
  BookOpen,
  Target,
  Youtube,
  Upload
} from 'lucide-react';
import { cn } from '../lib/utils';

interface HomePageProps {
  onStartTrading: () => void;
  onLogin: () => void;
  onNavigate: (pageTitle: string) => void;
  tutorials?: any[];
}

export default function HomePage({ onStartTrading, onLogin, onNavigate, tutorials = [] }: HomePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState({
    about: localStorage.getItem('hp_img_about') || 'https://picsum.photos/seed/office/800/800',
    app: localStorage.getItem('hp_img_app') || 'https://picsum.photos/seed/app/600/1200'
  });

  const handleImageUpload = (key: 'about' | 'app', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImages(prev => ({ ...prev, [key]: base64 }));
      localStorage.setItem(`hp_img_${key}`, base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 overflow-hidden bg-blue-600 text-white font-black text-xl">
                O
              </div>
              <span className="text-2xl font-black tracking-tighter">ONYX OPTION<span className="text-blue-500">.</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
              <button onClick={() => onNavigate('Features')} className="hover:text-[var(--text-primary)] transition-colors">Features</button>
              <button onClick={() => onNavigate('How it works')} className="hover:text-[var(--text-primary)] transition-colors">How it works</button>
              <button onClick={() => onNavigate('Live Trades')} className="hover:text-[var(--text-primary)] transition-colors">Live Trades</button>
              <button onClick={() => setIsEditing(!isEditing)} className={cn("transition-colors flex items-center gap-2", isEditing ? "text-blue-500" : "hover:text-[var(--text-primary)]")}>
                <Upload size={16} /> {isEditing ? 'Done Editing' : 'Customize'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={onLogin}
                className="hidden sm:block px-6 py-2.5 text-sm font-bold text-[var(--text-primary)] hover:text-blue-400 transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={onStartTrading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full transition-all active:scale-95 shadow-lg shadow-blue-600/20"
              >
                Start Trading
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
              <Zap size={14} className="animate-pulse" /> The Future of Digital Trading
            </span>
            <h1 className="text-[12vw] md:text-[10vw] lg:text-[112px] font-black tracking-[-0.04em] mb-8 leading-[0.85] uppercase">
              TRADE <span className="text-[var(--text-primary)]/20">THE</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 animate-gradient-x">FUTURE</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--text-secondary)] mb-12 leading-relaxed font-medium">
              Experience the world's most sophisticated binary options platform. <br className="hidden md:block" />
              Engineered for precision, built for traders.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onStartTrading}
                className="w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-[0_0_40px_rgba(37,99,235,0.3)] active:scale-95"
              >
                START TRADING NOW
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button 
                onClick={() => onNavigate('Market Analysis')}
                className="w-full sm:w-auto px-12 py-6 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-black rounded-2xl border border-[var(--border-color)] transition-all backdrop-blur-md active:scale-95"
              >
                LIVE MARKETS
              </button>
            </div>

            {/* Market Ticker */}
            <div className="mt-16 overflow-hidden border-y border-[var(--border-color)] bg-[var(--bg-secondary)]/[0.02] py-4">
              <div className="flex animate-marquee whitespace-nowrap gap-12">
                <TickerItem symbol="EUR/USD" price="1.0845" change="+0.12%" isUp />
                <TickerItem symbol="GBP/USD" price="1.2670" change="-0.05%" isUp={false} />
                <TickerItem symbol="BTC/USD" price="51,241.67" change="+2.45%" isUp />
                <TickerItem symbol="ETH/USD" price="2,950.12" change="+1.82%" isUp />
                <TickerItem symbol="AUD/USD" price="0.6550" change="-0.18%" isUp={false} />
                <TickerItem symbol="USD/JPY" price="150.42" change="+0.08%" isUp />
                {/* Duplicate for seamless loop */}
                <TickerItem symbol="EUR/USD" price="1.0845" change="+0.12%" isUp />
                <TickerItem symbol="GBP/USD" price="1.2670" change="-0.05%" isUp={false} />
                <TickerItem symbol="BTC/USD" price="51,241.67" change="+2.45%" isUp />
                <TickerItem symbol="ETH/USD" price="2,950.12" change="+1.82%" isUp />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 border-y border-[var(--border-color)] bg-[var(--bg-secondary)]/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            <PartnerLogo name="Binance" />
            <PartnerLogo name="MetaTrader" />
            <PartnerLogo name="TradingView" />
            <PartnerLogo name="Coinbase" />
            <PartnerLogo name="Investing.com" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden border border-[var(--border-color)] relative group bg-[var(--bg-secondary)] flex items-center justify-center">
                <div className="text-[var(--text-secondary)]">No image available</div>
                
                <div className="absolute bottom-10 left-10">
                  <div className="text-4xl font-black text-[var(--text-primary)] mb-2">EST. 2018</div>
                  <div className="text-sm text-blue-500 font-bold uppercase tracking-widest">Global Headquarters</div>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600 rounded-full flex flex-col items-center justify-center border-8 border-[var(--bg-primary)] shadow-2xl animate-bounce-slow">
                <div className="text-3xl font-black text-white">6+</div>
                <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Years Excellence</div>
              </div>
            </div>
            <div>
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Built by Traders, <br /><span className="text-[var(--text-primary)]/20">For Traders.</span></h2>
              <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
                Onyx Option was founded with a single mission: to democratize access to high-frequency digital trading. What started as a small team of quantitative analysts has grown into a global powerhouse serving millions of users.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <div className="text-2xl font-black text-[var(--text-primary)] mb-1">500+</div>
                  <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Employees</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[var(--text-primary)] mb-1">24/7</div>
                  <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Global Support</div>
                </div>
              </div>
              <button onClick={() => onNavigate('Help Center')} className="px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-primary)] font-black rounded-2xl hover:bg-[var(--text-secondary)] transition-all active:scale-95">
                LEARN MORE ABOUT US
              </button>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" className="py-32 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Start Trading in 3 Simple Steps</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Join millions of traders and start your journey to financial freedom today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/10 to-transparent -translate-y-1/2" />
            
            <StepCard 
              number="01"
              icon={<Download className="text-blue-500" size={32} />}
              title="Create Account"
              description="Sign up for a free account in less than 30 seconds. No credit card required to start."
            />
            <StepCard 
              number="02"
              icon={<CreditCard className="text-blue-500" size={32} />}
              title="Make Deposit"
              description="Fund your account with over 20+ payment methods including Crypto, Cards, and E-wallets."
            />
            <StepCard 
              number="03"
              icon={<TrendingUp className="text-blue-500" size={32} />}
              title="Start Trading"
              description="Choose your asset, set your investment, and start trading with up to 98% payout."
            />
          </div>
        </div>
      </section>

      {/* Live Trading Results */}
      <section id="live-trades" className="py-32 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Real-time Trading <span className="text-blue-500">Results</span>
              </h2>
              <p className="text-[var(--text-secondary)] text-lg mb-10 leading-relaxed">
                Join a community of successful traders. Our platform transparency allows you to see live market activity and top-performing trades.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <div className="text-3xl font-black text-blue-500 mb-1">98%</div>
                  <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Success Rate</div>
                </div>
                <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <div className="text-3xl font-black text-emerald-500 mb-1">5ms</div>
                  <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Avg. Latency</div>
                </div>
              </div>
              <button onClick={() => onNavigate('Tournaments')} className="flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
                View Full Leaderboard <ArrowRight size={18} />
              </button>
            </div>
            
            <div className="bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]/[0.02]">
                <h3 className="font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Trading Feed
                </h3>
                <span className="text-xs text-[var(--text-secondary)] font-mono">UTC 18:45:32</span>
              </div>
              <div className="p-0">
                <table className="w-full text-left text-sm">
                  <thead className="text-[var(--text-secondary)] bg-[var(--bg-secondary)]/[0.01]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Asset</th>
                      <th className="px-6 py-4 font-medium">Time</th>
                      <th className="px-6 py-4 font-medium">Investment</th>
                      <th className="px-6 py-4 font-medium text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    <LiveTradeRow asset="EUR/USD" time="18:45:12" amount="$1,200" profit="+$1,104" isWin />
                    <LiveTradeRow asset="BTC/USD" time="18:44:58" amount="$500" profit="+$450" isWin />
                    <LiveTradeRow asset="GBP/JPY" time="18:44:32" amount="$2,500" profit="+$2,300" isWin />
                    <LiveTradeRow asset="ETH/USD" time="18:44:15" amount="$100" profit="-$100" isWin={false} />
                    <LiveTradeRow asset="AUD/CAD" time="18:43:50" amount="$800" profit="+$736" isWin />
                    <LiveTradeRow asset="USD/CHF" time="18:43:22" amount="$1,500" profit="+$1,380" isWin />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Experience */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-[3rem] border border-[var(--border-color)] p-12 lg:p-20 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 block">Trading on the go</span>
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                  Powerful Mobile App for <span className="text-blue-500">iOS & Android</span>
                </h2>
                <p className="text-[var(--text-secondary)] text-lg mb-10 leading-relaxed">
                  Experience the full power of our trading terminal in the palm of your hand. Real-time notifications, instant execution, and all technical indicators included.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-3 px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl font-bold hover:bg-[var(--text-secondary)] transition-all">
                    <Smartphone size={20} />
                    App Store
                  </button>
                  <button className="flex items-center gap-3 px-6 py-3 bg-[var(--text-primary)]/10 text-[var(--text-primary)] rounded-xl font-bold hover:bg-[var(--text-primary)]/20 transition-all border border-[var(--border-color)]">
                    <Play size={20} className="fill-[var(--text-primary)]" />
                    Google Play
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10 mx-auto w-[280px] h-[580px] bg-[var(--bg-primary)] rounded-[3rem] border-[8px] border-[var(--bg-secondary)] shadow-2xl overflow-hidden flex flex-col">
                   {/* Abstract Mobile UI */}
                   <div className="p-6 pb-2 flex justify-between items-center">
                     <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)]"></div>
                     <div className="w-16 h-4 rounded-full bg-[var(--bg-secondary)]"></div>
                     <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)]"></div>
                   </div>
                   <div className="p-6 pt-2">
                     <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">$12,450.00</div>
                     <div className="text-sm text-emerald-500">+ $450.00 (Today)</div>
                   </div>
                   
                   <div className="flex-1 p-6 flex flex-col gap-4">
                     <div className="h-32 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-[var(--border-color)] flex items-center justify-center">
                       <Activity className="text-blue-500 opacity-50" size={48} />
                     </div>
                     <div className="flex gap-4">
                       <div className="flex-1 h-24 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"></div>
                       <div className="flex-1 h-24 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"></div>
                     </div>
                     <div className="flex-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] mt-2"></div>
                   </div>

                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                   <div className="absolute bottom-10 left-0 right-0 px-6">
                      <div className="h-1 w-20 bg-[var(--text-primary)]/20 mx-auto rounded-full mb-8" />
                      <div className="space-y-4">
                        <div className="h-12 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)]/50 text-sm font-bold">SELL</div>
                        <div className="h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">BUY</div>
                      </div>
                   </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-600/10 blur-[100px] -z-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-32 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--bg-primary)] rounded-[3rem] border border-[var(--border-color)] p-12 lg:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/5 blur-[100px] -z-10 group-hover:bg-blue-600/10 transition-colors duration-1000" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 block">Mobile Trading</span>
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Trade Anywhere, <br /><span className="text-[var(--text-primary)]/20">Anytime.</span></h2>
                <p className="text-[var(--text-secondary)] text-lg mb-12 leading-relaxed">
                  Get the full Onyx experience on your mobile device. Scan the QR code to download our professional trading app for iOS and Android.
                </p>
                
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="p-4 bg-white rounded-3xl shadow-2xl shadow-[var(--text-primary)]/10 group-hover:scale-105 transition-transform duration-500">
                    <div className="w-32 h-32 bg-black flex items-center justify-center rounded-2xl">
                      {/* Abstract QR Code */}
                      <div className="grid grid-cols-4 gap-1 w-24 h-24">
                        {[...Array(16)].map((_, i) => (
                          <div key={i} className={cn("rounded-sm", Math.random() > 0.5 ? "bg-white" : "bg-transparent")} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer">
                      <Smartphone size={24} className="text-blue-500" />
                      <div>
                        <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Download on the</div>
                        <div className="text-sm font-black text-[var(--text-primary)]">App Store</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 px-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer">
                      <Play size={24} className="text-emerald-500 fill-emerald-500" />
                      <div>
                        <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Get it on</div>
                        <div className="text-sm font-black text-[var(--text-primary)]">Google Play</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative hidden lg:block">
                <div className="relative z-10 mx-auto w-[300px] h-[600px] bg-black rounded-[3.5rem] border-[10px] border-[var(--bg-secondary)] shadow-2xl overflow-hidden group/app flex items-center justify-center">
                  <div className="text-white/50">No preview available</div>
                  
                  <div className="absolute bottom-12 left-0 right-0 px-8 pointer-events-none">
                    <div className="h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black tracking-widest text-sm shadow-xl shadow-blue-600/20">
                      START TRADING
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[100px] -z-10 rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/20 blur-[100px] -z-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Trading Education Hub</h2>
              <p className="text-[var(--text-secondary)]">Master the markets with our comprehensive learning materials. From basics to advanced strategies, we have you covered.</p>
            </div>
            <button onClick={() => onNavigate('Education Hub')} className="px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl font-bold hover:bg-[var(--bg-tertiary)] transition-all">
              Browse All Tutorials
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tutorials.length > 0 ? (
              tutorials.slice(0, 3).map((video, idx) => (
                <a key={video.id || idx} href={video.link} target="_blank" rel="noopener noreferrer">
                  <EducationCard 
                    icon={<Youtube size={64} />}
                    category={video.category}
                    title={video.title}
                    duration={video.duration}
                  />
                </a>
              ))
            ) : (
              <>
                <EducationCard 
                  icon={<BookOpen size={64} />}
                  category="Basics"
                  title="Introduction to Binary Options"
                  duration="15 min read"
                />
                <EducationCard 
                  icon={<Target size={64} />}
                  category="Strategy"
                  title="Mastering Support & Resistance"
                  duration="25 min read"
                />
                <EducationCard 
                  icon={<Activity size={64} />}
                  category="Advanced"
                  title="Psychology of Professional Trading"
                  duration="20 min read"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-32 bg-[var(--bg-primary)] border-t border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Transparency & Trust</span>
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Legal & <span className="text-[var(--text-primary)]/20">Compliance</span></h2>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                We believe in complete transparency. Access our full library of legal frameworks, trading conditions, and regulatory compliance documents.
              </p>
            </div>
            <button onClick={() => onNavigate('Terms of Service')} className="px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl font-bold hover:bg-[var(--bg-tertiary)] transition-all flex items-center gap-2 backdrop-blur-md group">
              <Download size={20} className="group-hover:translate-y-0.5 transition-transform" /> Download Archive
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DocumentCard 
              icon={<Shield className="text-blue-500" size={24} />}
              title="Terms of Service"
              description="General rules and regulations for using the Onyx platform."
              size="2.4 MB"
              date="Updated Mar 2024"
            />
            {/* ... other DocumentCards ... */}
            <DocumentCard 
              icon={<Lock className="text-emerald-500" size={24} />}
              title="Privacy Policy"
              description="How we protect and manage your personal data and security."
              size="1.8 MB"
              date="Updated Feb 2024"
            />
            <DocumentCard 
              icon={<AlertTriangle className="text-rose-500" size={24} />}
              title="Risk Disclosure"
              description="Important information about the risks of financial trading."
              size="1.2 MB"
              date="Updated Jan 2024"
            />
            <DocumentCard 
              icon={<FileText className="text-indigo-500" size={24} />}
              title="Trading Conditions"
              description="Detailed specifications for assets, payouts, and execution."
              size="3.5 MB"
              date="Updated Mar 2024"
            />
            <DocumentCard 
              icon={<CheckCircle2 className="text-blue-500" size={24} />}
              title="AML & KYC Policy"
              description="Anti-Money Laundering and Know Your Customer procedures."
              size="1.5 MB"
              date="Updated Dec 2023"
            />
            <DocumentCard 
              icon={<Building className="text-purple-500" size={24} />}
              title="Company Registration"
              description="Official certificate of incorporation and business license."
              size="4.1 MB"
              date="Valid until 2025"
            />
            <DocumentCard 
              icon={<Target className="text-orange-500" size={24} />}
              title="Order Execution Policy"
              description="Our commitment to best execution and price transparency."
              size="1.1 MB"
              date="Updated Feb 2024"
            />
            <DocumentCard 
              icon={<Users className="text-cyan-500" size={24} />}
              title="Conflict of Interest"
              description="How we identify and manage potential conflicts of interest."
              size="0.9 MB"
              date="Updated Jan 2024"
            />
            <DocumentCard 
              icon={<Activity className="text-yellow-500" size={24} />}
              title="Complaints Procedure"
              description="Step-by-step guide on how to file and resolve complaints."
              size="0.7 MB"
              date="Updated Mar 2024"
            />
            <DocumentCard 
              icon={<Globe className="text-blue-400" size={24} />}
              title="Regulatory License"
              description="Official regulatory authorization for financial services."
              size="2.8 MB"
              date="Updated Jan 2024"
            />
            <DocumentCard 
              icon={<CreditCard className="text-emerald-400" size={24} />}
              title="Payment Policy"
              description="Rules for deposits, withdrawals, and fee structures."
              size="1.4 MB"
              date="Updated Feb 2024"
            />
            <DocumentCard 
              icon={<Star className="text-yellow-400" size={24} />}
              title="Bonus Terms"
              description="Conditions for promotional offers and bonus funds."
              size="0.8 MB"
              date="Updated Mar 2024"
            />
          </div>
        </div>
      </section>

      {/* Global Network */}
      <section className="py-32 bg-[var(--bg-primary)] overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Global Trading Network</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Our infrastructure spans across 5 continents, providing ultra-low latency execution for traders worldwide.</p>
          </div>
          
          <div className="relative aspect-[21/9] w-full bg-[var(--bg-secondary)]/[0.02] rounded-[3rem] border border-[var(--border-color)] flex items-center justify-center group overflow-hidden">
             {/* Abstract Map Dots */}
             <div className="absolute inset-0 opacity-20">
                {[...Array(50)].map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-1 h-1 bg-blue-500 rounded-full animate-pulse"
                    style={{ 
                      top: `${Math.random() * 100}%`, 
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`
                    }}
                  />
                ))}
             </div>
             <div className="relative z-10 flex flex-col items-center">
                <Globe className="text-blue-500 mb-6 animate-spin-slow" size={80} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                   <div>
                      <div className="text-2xl font-bold text-[var(--text-primary)]">150+</div>
                      <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Countries</div>
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-[var(--text-primary)]">12</div>
                      <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Data Centers</div>
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-[var(--text-primary)]">2.4M</div>
                      <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Active Traders</div>
                   </div>
                   <div>
                      <div className="text-2xl font-bold text-[var(--text-primary)]">5ms</div>
                      <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Avg. Latency</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Security Infrastructure */}
      <section className="py-32 bg-[var(--bg-primary)] overflow-hidden relative border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  Military-Grade <span className="text-blue-500">Security</span>
                </h2>
                <p className="text-[var(--text-secondary)] text-lg mb-10 leading-relaxed">
                  Your security is our top priority. We employ the most advanced encryption and protection protocols to ensure your data and funds are always safe.
                </p>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                         <Shield className="text-blue-500" size={24} />
                      </div>
                      <div>
                         <h4 className="font-bold mb-1">AES-256 Encryption</h4>
                         <p className="text-sm text-[var(--text-secondary)]">All data transmissions are protected by 256-bit SSL encryption.</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                         <Lock className="text-emerald-500" size={24} />
                      </div>
                      <div>
                         <h4 className="font-bold mb-1">Two-Factor Authentication</h4>
                         <p className="text-sm text-[var(--text-secondary)]">Secure your account with 2FA via Google Authenticator or SMS.</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                         <CheckCircle2 className="text-indigo-500" size={24} />
                      </div>
                      <div>
                         <h4 className="font-bold mb-1">Segregated Accounts</h4>
                         <p className="text-sm text-[var(--text-secondary)]">Client funds are kept in separate accounts with top-tier global banks.</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="relative">
                <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                   <div className="relative z-10 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full bg-blue-600/20 flex items-center justify-center mb-6 animate-pulse border border-blue-500/30">
                         <Shield className="text-blue-500" size={64} />
                      </div>
                      <div className="text-center">
                         <div className="text-2xl font-black text-[var(--text-primary)] mb-2 uppercase tracking-tighter">SECURED BY ONYX</div>
                         <div className="flex items-center gap-2 justify-center text-emerald-500 text-xs font-bold uppercase tracking-widest">
                            <Activity size={14} /> System Status: Operational
                         </div>
                      </div>
                   </div>
                   {/* Decorative Rings */}
                   <div className="absolute w-[80%] h-[80%] border border-[var(--border-color)] rounded-full animate-spin-slow" />
                   <div className="absolute w-[60%] h-[60%] border border-[var(--border-color)] rounded-full animate-spin-slow-reverse" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-32 bg-[var(--bg-primary)] border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                <Shield className="text-blue-500" size={32} />
              </div>
              <h4 className="font-bold mb-2">Regulated</h4>
              <p className="text-xs text-[var(--text-secondary)]">Fully compliant with international standards.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <Lock className="text-emerald-500" size={32} />
              </div>
              <h4 className="font-bold mb-2">Secure Funds</h4>
              <p className="text-xs text-[var(--text-secondary)]">Segregated accounts with top-tier banks.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                <CheckCircle2 className="text-indigo-500" size={32} />
              </div>
              <h4 className="font-bold mb-2">Verified</h4>
              <p className="text-xs text-[var(--text-secondary)]">Over 2.4 million verified active traders.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                <HeadphonesIcon className="text-rose-500" size={32} />
              </div>
              <h4 className="font-bold mb-2">24/7 Support</h4>
              <p className="text-xs text-[var(--text-secondary)]">Professional assistance in 15+ languages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Advanced Trading Features</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Everything you need to master the financial markets in one powerful platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-blue-500" size={32} />}
              title="Instant Execution"
              description="Trades are executed in less than 5ms, ensuring you get the best possible price every time."
            />
            <FeatureCard 
              icon={<Shield className="text-blue-500" size={32} />}
              title="Secure Platform"
              description="Military-grade encryption and segregated accounts to keep your funds and data safe."
            />
            <FeatureCard 
              icon={<BarChart2 className="text-blue-500" size={32} />}
              title="Advanced Charts"
              description="Professional technical indicators and drawing tools built directly into the terminal."
            />
            <FeatureCard 
              icon={<Globe className="text-blue-500" size={32} />}
              title="Global Markets"
              description="Trade Forex, Crypto, Stocks, and Commodities from a single unified interface."
            />
            <FeatureCard 
              icon={<Smartphone className="text-blue-500" size={32} />}
              title="Mobile Trading"
              description="Powerful apps for iOS and Android so you can trade anywhere, anytime."
            />
            <FeatureCard 
              icon={<Users className="text-blue-500" size={32} />}
              title="Social Trading"
              description="Follow top-performing traders and copy their successful strategies automatically."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Trusted by Millions</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">Hear from our community of professional traders from around the globe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Alex Rivera"
              role="Professional Trader"
              content="ONYX OPTION has the fastest execution I've ever experienced. The interface is clean and the indicators are top-notch."
              rating={5}
            />
            <TestimonialCard 
              name="Sarah Chen"
              role="Crypto Analyst"
              content="The payout rates are consistently higher than other platforms. I've been using it for 2 years and the withdrawals are always fast."
              rating={5}
            />
            <TestimonialCard 
              name="Marcus Thorne"
              role="Full-time Scalper"
              content="The mobile app is a game changer. I can manage my positions on the go with the same precision as the desktop version."
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-[var(--text-secondary)]">Everything you need to know about the platform.</p>
          </div>

          <div className="space-y-4">
            <FAQItem 
              question="What is the minimum deposit?"
              answer="The minimum deposit to start trading on a live account is only $10. However, you can start practicing on our demo account with $10,000 in virtual funds for free."
            />
            <FAQItem 
              question="How long do withdrawals take?"
              answer="Withdrawals are typically processed within 24 hours. Depending on your payment method, funds usually arrive in your account within 1-3 business days."
            />
            <FAQItem 
              question="Is ONYX OPTION regulated?"
              answer="Yes, ONYX OPTION follows strict international financial regulations and keeps all client funds in segregated accounts with top-tier global banks."
            />
            <FAQItem 
              question="Can I trade on my mobile device?"
              answer="Absolutely! We offer powerful mobile applications for both iOS and Android, providing the full trading experience on the go."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10 blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to start trading?</h2>
          <p className="text-[var(--text-secondary)] text-xl mb-12 max-w-2xl mx-auto">Join over 2.4 million traders and experience the future of digital options trading today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStartTrading}
              className="px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-blue-600/40"
            >
              Get Started for Free
            </button>
            <button className="flex items-center gap-3 text-[var(--text-primary)] font-bold hover:text-blue-400 transition-colors">
              <Smartphone size={24} />
              Download Mobile App
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-blue-600" size={24} />
                <span className="text-xl font-bold tracking-tighter">ONYX OPTION<span className="text-blue-500">.</span></span>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                The most advanced digital trading platform. Join millions of traders worldwide and master the financial markets.
              </p>
              <div className="flex gap-4">
                <SocialLink icon={<Globe size={18} />} />
                <SocialLink icon={<Smartphone size={18} />} />
                <SocialLink icon={<Users size={18} />} />
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-[var(--text-secondary)]">Platform</h4>
              <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                <li><button onClick={() => onNavigate('Trading Terminal')} className="hover:text-[var(--text-primary)] transition-colors">Trading Terminal</button></li>
                <li><button onClick={() => onNavigate('Market Analysis')} className="hover:text-[var(--text-primary)] transition-colors">Market Analysis</button></li>
                <li><button onClick={() => onNavigate('Trading Signals')} className="hover:text-[var(--text-primary)] transition-colors">Trading Signals</button></li>
                <li><button onClick={() => onNavigate('Tournaments')} className="hover:text-[var(--text-primary)] transition-colors">Tournaments</button></li>
                <li><button onClick={() => onNavigate('Affiliate Program')} className="hover:text-[var(--text-primary)] transition-colors">Affiliate Program</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-[var(--text-secondary)]">Support</h4>
              <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                <li><button onClick={() => onNavigate('Help Center')} className="hover:text-[var(--text-primary)] transition-colors">Help Center</button></li>
                <li><button onClick={() => onNavigate('Live Support')} className="hover:text-[var(--text-primary)] transition-colors">Live Support</button></li>
                <li><button onClick={() => onNavigate('Education Hub')} className="hover:text-[var(--text-primary)] transition-colors">Education Hub</button></li>
                <li><button onClick={() => onNavigate('FAQ')} className="hover:text-[var(--text-primary)] transition-colors">FAQ</button></li>
                <li><button onClick={() => onNavigate('Security')} className="hover:text-[var(--text-primary)] transition-colors">Security</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-[var(--text-secondary)]">Legal</h4>
              <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                <li><button onClick={() => onNavigate('Privacy Policy')} className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => onNavigate('Terms of Service')} className="hover:text-[var(--text-primary)] transition-colors">Terms of Service</button></li>
                <li><button onClick={() => onNavigate('Risk Disclosure')} className="hover:text-[var(--text-primary)] transition-colors">Risk Disclosure</button></li>
                <li><button onClick={() => onNavigate('AML Policy')} className="hover:text-[var(--text-primary)] transition-colors">AML Policy</button></li>
                <li><button onClick={() => onNavigate('Cookie Policy')} className="hover:text-[var(--text-primary)] transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[var(--text-secondary)] text-xs">
              © 2024 ONYX OPTION Trading Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs">
                  <Shield size={14} />
                  SSL Secured
               </div>
               <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs">
                  <Lock size={14} />
                  256-bit Encryption
               </div>
            </div>
          </div>
          
          <div className="mt-10 p-8 bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)]">
            <h5 className="text-xs font-bold text-[var(--text-secondary)] mb-4 uppercase tracking-widest">Risk Disclosure</h5>
            <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
              RISK WARNING: Trading on financial markets involves significant risk and can result in the loss of your invested capital. Digital options trading may not be suitable for all investors. Please ensure you fully understand the risks involved before trading. The platform provides a demo account for educational purposes. Past performance is not indicative of future results. ONYX OPTION does not provide financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-secondary)] backdrop-blur-xl p-6 rounded-2xl border border-[var(--border-color)] text-center hover:bg-[var(--bg-tertiary)] transition-colors group">
      <div className="text-2xl font-black text-[var(--text-primary)] mb-1 group-hover:scale-110 transition-transform">{value}</div>
      <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-all group"
    >
      <div className="mb-6 group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function TickerItem({ symbol, price, change, isUp }: { symbol: string; price: string; change: string; isUp: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-[var(--text-secondary)]">{symbol}</span>
      <span className="text-sm font-mono font-medium text-[var(--text-primary)]">{price}</span>
      <span className={cn("text-xs font-bold", isUp ? "text-emerald-500" : "text-rose-500")}>
        {change}
      </span>
    </div>
  );
}

function StepCard({ number, icon, title, description }: { number: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative z-10 p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-blue-500/50 transition-colors group">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-600/20">
        {number}
      </div>
      <div className="mb-6 group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">{title}</h3>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function LiveTradeRow({ asset, time, amount, profit, isWin }: { asset: string; time: string; amount: string; profit: string; isWin: boolean }) {
  return (
    <tr className="hover:bg-[var(--bg-secondary)]/[0.02] transition-colors">
      <td className="px-6 py-4 font-bold text-[var(--text-primary)]">{asset}</td>
      <td className="px-6 py-4 text-[var(--text-secondary)] font-mono">{time}</td>
      <td className="px-6 py-4 text-[var(--text-secondary)]">{amount}</td>
      <td className={cn("px-6 py-4 text-right font-bold", isWin ? "text-emerald-500" : "text-rose-500")}>
        {profit}
      </td>
    </tr>
  );
}

function TestimonialCard({ name, role, content, rating }: { name: string; role: string; content: string; rating: number }) {
  return (
    <div className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col">
      <div className="flex gap-1 mb-6">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
        ))}
      </div>
      <p className="text-[var(--text-secondary)] italic mb-8 leading-relaxed">"{content}"</p>
      <div className="mt-auto flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500" />
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)]">{name}</h4>
          <p className="text-xs text-[var(--text-secondary)]">{role}</p>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        <span className="font-bold text-[var(--text-primary)]">{question}</span>
        {isOpen ? <ChevronUp size={20} className="text-[var(--text-secondary)]" /> : <ChevronDown size={20} className="text-[var(--text-secondary)]" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 text-[var(--text-secondary)] text-sm leading-relaxed"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
      {icon}
    </a>
  );
}

function EducationCard({ icon, category, title, duration }: { icon: React.ReactNode; category: string; title: string; duration: string }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-secondary)]/[0.5] border border-[var(--border-color)] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="text-[var(--text-secondary)] group-hover:text-blue-500/50 transition-colors duration-700 group-hover:scale-110 transform">
          {icon}
        </div>
        <div className="absolute top-4 left-4 px-4 py-2 bg-[var(--bg-primary)]/60 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-widest text-blue-400 border border-[var(--border-color)]">
          {category}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">{title}</h3>
      <div className="flex items-center gap-4 text-[var(--text-secondary)] text-xs">
        <span className="flex items-center gap-1"><Clock size={14} /> {duration}</span>
        <span className="flex items-center gap-1 text-blue-500 font-bold">Read More <ChevronRight size={14} /></span>
      </div>
    </div>
  );
}

function DocumentCard({ icon, title, description, size, date }: { icon: React.ReactNode; title: string; description: string; size: string; date: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-all group cursor-pointer flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Download size={20} className="text-blue-500" />
      </div>
      <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h4 className="text-lg font-black mb-2 text-[var(--text-primary)] group-hover:text-blue-400 transition-colors uppercase tracking-tight">{title}</h4>
      <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed flex-1">{description}</p>
      <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
          <span>{size}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-secondary)]"></span>
          <span>{date}</span>
        </div>
        <div className="text-blue-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          View PDF
        </div>
      </div>
    </div>
  );
}

function PartnerLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="w-8 h-8 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
        <Globe size={18} className="text-[var(--text-secondary)] group-hover:text-blue-500 transition-colors" />
      </div>
      <span className="text-xl font-black tracking-tighter text-[var(--text-primary)]">{name}</span>
    </div>
  );
}
