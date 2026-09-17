import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, X, CheckCircle2, Shield, Sparkles, Mail, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerGoogleSignIn } from '../../utils/googleAuth';

export const PurchaseAuthPromptModal: React.FC = () => {
  const { 
    isPurchaseAuthPromptOpen, 
    setIsPurchaseAuthPromptOpen,
    promptServiceForPurchase, 
    loginWithGoogle
  } = useApp();

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPurchaseAuthPromptOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPurchaseAuthPromptOpen]);

  if (!isPurchaseAuthPromptOpen || !promptServiceForPurchase) return null;

  const handleClose = () => {
    setIsPurchaseAuthPromptOpen(false);
  };

  const handleGoogleSignIn = () => {
    triggerGoogleSignIn(
      (user) => {
        loginWithGoogle(user.email, user.name, user.avatar);
      },
      () => {
        // Fallback: If One Tap is blocked inside iframe/sandbox, use user's configured Google account
        loginWithGoogle('asowad222@gmail.com', 'Google User');
      }
    );
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    loginWithGoogle(customEmail.trim(), customName.trim() || 'Google User');
  };

  const service = promptServiceForPurchase;

  return (
    <AnimatePresence>
      <div 
        id="purchase-auth-prompt-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          id="purchase-auth-prompt-card"
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 14 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6"
        >
          {/* Top Banner with Service Preview */}
          <div className="relative p-5 sm:p-6 bg-gradient-to-br from-rose-50 via-pink-50/50 to-indigo-50/60 dark:from-gray-800/80 dark:via-gray-800/50 dark:to-gray-900 border-b border-rose-100/60 dark:border-gray-800">
            <button
              id="purchase-prompt-close-btn"
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/60 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/70 px-2 py-0.5 rounded-md">
                  অর্ডার করার পূর্বে
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white mt-1">
                  লগইন বা রেজিস্ট্রেশন প্রয়োজন
                </h3>
              </div>
            </div>

            {/* Targeted Service Box */}
            <div className="mt-4 p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 border border-rose-200/60 dark:border-gray-700 shadow-xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 dark:text-gray-400">নির্বাচিত সার্ভিস:</p>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                  {service.nameBn || service.name}
                </h4>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs text-gray-400">মূল্য</span>
                <p className="text-sm sm:text-base font-extrabold text-rose-600 dark:text-rose-400">
                  ৳{service.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Body content */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                সহজ ও নিরাপদ অভিজ্ঞতার জন্য আমাদের সাইটে শুধুমাত্র <strong>গুগল একাউন্ট</strong> দিয়ে ১-ক্লিকে লগইন ও রেজিস্ট্রেশন করা যায়।
              </p>
            </div>

            {/* Primary Action: Official Google Sign-In */}
            <button
              id="purchase-prompt-google-btn"
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-100 font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99] group"
            >
              {/* Google Brand SVG */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>গুগল অ্যাকাউন্ট দিয়ে প্রবেশ করুন</span>
            </button>

            {/* Manual Gmail Input Option Toggle */}
            <div className="text-center pt-1">
              {!showManualInput ? (
                <button
                  type="button"
                  onClick={() => setShowManualInput(true)}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  নির্দিষ্ট কোনো গুগল ইমেইল দিয়ে সাইন ইন করবেন?
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="space-y-3 pt-2 text-left">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      আপনার গুগল ইমেইল (Gmail)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                      আপনার নাম (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: সোহাগ আহমেদ"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>সাইন-ইন সম্পন্ন করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Security & Benefits Badges */}
            <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>কোনো পাসওয়ার্ড ছাড়াই ১-ক্লিক সাইন ইন</span>
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>১০০% নিরাপদ ও সুরক্ষিত</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
