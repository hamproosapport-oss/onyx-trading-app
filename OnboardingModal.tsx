import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check, TrendingUp, Wallet, BarChart2 } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: 'Welcome to Onyx Option',
    description: 'Your professional binary options trading platform. Let\'s get you started with a quick tour of the core features.',
    icon: <TrendingUp className="w-12 h-12 text-blue-500 mb-4" />
  },
  {
    title: 'Real-Time Charts',
    description: 'Analyze market trends with our advanced, real-time charting tools. Switch between different assets and timeframes to find the perfect entry point.',
    icon: <BarChart2 className="w-12 h-12 text-green-500 mb-4" />
  },
  {
    title: 'Demo & Real Accounts',
    description: 'Practice your strategies risk-free with a $10,000 Demo account. When you\'re ready, switch to your Real account and start trading with your local currency.',
    icon: <Wallet className="w-12 h-12 text-purple-500 mb-4" />
  },
  {
    title: 'Place Your First Trade',
    description: 'Select your investment amount, choose the expiration time, and predict whether the price will go UP or DOWN. It\'s that simple!',
    icon: <Check className="w-12 h-12 text-orange-500 mb-4" />
  }
];

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--bg-secondary)] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[var(--border-color)]"
        >
          <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
            <h3 className="font-bold text-[var(--text-primary)]">Quick Tour</h3>
            <button onClick={onClose} className="p-2 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="p-8 flex flex-col items-center text-center min-h-[280px] justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                {STEPS[currentStep].icon}
                <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">{STEPS[currentStep].title}</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {STEPS[currentStep].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-4 bg-[var(--bg-tertiary)]/30 border-t border-[var(--border-color)] flex items-center justify-between">
            <div className="flex gap-1.5">
              {STEPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-blue-500' : 'w-1.5 bg-[var(--border-color)]'}`}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button 
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleNext}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors flex items-center gap-1 shadow-lg shadow-blue-500/20"
              >
                {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < STEPS.length - 1 && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
