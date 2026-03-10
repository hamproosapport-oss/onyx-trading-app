import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Gift, Users, TrendingUp, ChevronLeft, Info, Check, Share2, Award, ArrowRight, Wallet, ShieldCheck, Zap } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { cn } from '../lib/utils';

interface ReferralPageProps {
  user: FirebaseUser | null;
  referralSettings: any;
  currencySymbol: string;
  onBack: () => void;
}

export const ReferralPage: React.FC<ReferralPageProps> = ({ user, referralSettings, currencySymbol, onBack }) => {
  const referralCode = user ? user.uid.slice(0, 8).toUpperCase() : 'LOGIN';
  const referralLink = `${window.location.origin}?ref=${referralCode}`;
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'NETWORK'>('OVERVIEW');

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on this amazing trading platform!',
          text: `Sign up using my referral link and get a ${currencySymbol}${referralSettings.bonusAmount} bonus!`,
          url: referralLink,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      handleCopy();
    }
  };

  const shareVia = (platform: string) => {
    const text = encodeURIComponent(`Join me and get a ${currencySymbol}${referralSettings.bonusAmount} bonus! Use my link: `);
    const url = encodeURIComponent(referralLink);
    let shareUrl = '';
    
    switch(platform) {
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${text}${url}`; break;
      case 'telegram': shareUrl = `https://t.me/share/url?url=${url}&text=${text}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  return (
    <div className="h-full overflow-y-auto bg-[var(--bg-secondary)] text-[var(--text-primary)] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] p-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-[var(--text-primary)]/5 rounded-full transition">
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-black tracking-tight">Affiliate Hub</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 text-white shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
              <Award size={14} className="text-yellow-300" /> VIP Program
            </div>
            <h2 className="text-3xl font-black leading-tight mb-2">
              Invite Friends,<br/>Earn Crypto.
            </h2>
            <p className="text-blue-100 text-sm mb-6 max-w-[280px]">
              Get up to {referralSettings.referralPercentage}% commission on trading fees and a {currencySymbol}{referralSettings.bonusAmount} bonus for every active referral.
            </p>

            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-2 flex items-center gap-2 border border-white/10">
              <div className="flex-1 px-3 py-2 bg-black/40 rounded-xl overflow-hidden">
                <div className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mb-1">Your Referral Link</div>
                <div className="font-mono text-sm truncate text-white">{referralLink}</div>
              </div>
              <button 
                onClick={handleCopy}
                className="w-12 h-12 flex items-center justify-center bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition active:scale-95 shrink-0"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
              <button 
                onClick={handleShare}
                className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition active:scale-95 shrink-0"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Share */}
        <div className="flex items-center gap-3">
          <button onClick={() => shareVia('whatsapp')} className="flex-1 py-3 bg-[#25D366]/10 text-[#25D366] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition">
            WhatsApp
          </button>
          <button onClick={() => shareVia('telegram')} className="flex-1 py-3 bg-[#0088cc]/10 text-[#0088cc] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-[#0088cc]/20 hover:bg-[#0088cc]/20 transition">
            Telegram
          </button>
          <button onClick={() => shareVia('twitter')} className="flex-1 py-3 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 transition">
            Twitter
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]">
          <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition", activeTab === 'OVERVIEW' ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('NETWORK')}
            className={cn("flex-1 py-2 text-sm font-bold rounded-xl transition", activeTab === 'NETWORK' ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
          >
            My Network
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'OVERVIEW' ? (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--bg-primary)] p-5 rounded-3xl border border-[var(--border-color)]">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                    <Users size={20} className="text-blue-500" />
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] font-medium mb-1">Total Referrals</div>
                  <div className="text-3xl font-black">0</div>
                </div>
                <div className="bg-[var(--bg-primary)] p-5 rounded-3xl border border-[var(--border-color)]">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                    <Wallet size={20} className="text-emerald-500" />
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] font-medium mb-1">Total Earned</div>
                  <div className="text-3xl font-black text-emerald-500">{currencySymbol}0.00</div>
                </div>
              </div>

              {/* Tiers / Progress */}
              <div className="bg-[var(--bg-primary)] rounded-3xl p-6 border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-lg">Your Tier: Bronze</h3>
                  <div className="px-3 py-1 rounded-full bg-[var(--text-primary)]/5 text-xs font-bold">
                    Level 1
                  </div>
                </div>
                
                <div className="relative h-2 bg-[var(--bg-secondary)] rounded-full mb-2 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[10%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)] font-medium mb-6">
                  <span>0 Refs</span>
                  <span>Next Tier: 10 Refs</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-secondary)] border border-blue-500/30 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <ShieldCheck size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Bronze (Current)</div>
                        <div className="text-xs text-[var(--text-secondary)]">{referralSettings.referralPercentage}% Commission</div>
                      </div>
                    </div>
                    <Check size={20} className="text-blue-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--text-primary)]/10 flex items-center justify-center">
                        <Zap size={16} className="text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">Silver</div>
                        <div className="text-xs text-[var(--text-secondary)]">{referralSettings.referralPercentage + 2}% Commission</div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-[var(--text-secondary)]">10 Refs</div>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-[var(--bg-primary)] rounded-3xl p-6 border border-[var(--border-color)]">
                <h3 className="font-black text-lg mb-6">How it works</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border-color)] before:to-transparent">
                  
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-primary)] bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      1
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
                      <h4 className="font-bold text-sm mb-1">Share Link</h4>
                      <p className="text-xs text-[var(--text-secondary)]">Send your unique invite link to friends.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-primary)] bg-indigo-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      2
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
                      <h4 className="font-bold text-sm mb-1">Friends Join</h4>
                      <p className="text-xs text-[var(--text-secondary)]">They sign up and deposit {currencySymbol}{referralSettings.minDepositForBonus}+.</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--bg-primary)] bg-purple-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      3
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
                      <h4 className="font-bold text-sm mb-1">Earn Rewards</h4>
                      <p className="text-xs text-[var(--text-secondary)]">You both get {currencySymbol}{referralSettings.bonusAmount} + you earn {referralSettings.referralPercentage}% commission.</p>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="network"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border-color)] text-center flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="w-24 h-24 bg-[var(--text-primary)]/5 rounded-full flex items-center justify-center mb-6">
                <Users size={40} className="text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-xl font-black mb-2">No Referrals Yet</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-[250px]">
                Share your link with friends to start building your network and earning passive income.
              </p>
              <button 
                onClick={handleShare}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition active:scale-95 flex items-center gap-2"
              >
                <Share2 size={18} /> Share Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
