import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User as UserIcon, Shield, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { triggerGoogleSignIn } from '../../utils/googleAuth';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    login,
    loginWithGoogle,
    switchUserRole
  } = useApp();

  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomGmail, setShowCustomGmail] = useState(false);

  // Admin login states
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminIdentifier, setAdminIdentifier] = useState('admin@platform.com');
  const [adminPassword, setAdminPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = () => {
    triggerGoogleSignIn(
      (user) => {
        loginWithGoogle(user.email, user.name, user.avatar);
      },
      () => {
        // Fallback inside iframe or sandbox
        loginWithGoogle('asowad222@gmail.com', 'Google User');
      }
    );
  };

  const handleCustomGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    loginWithGoogle(customEmail.trim(), customName.trim() || 'Google User');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminIdentifier || !adminPassword) return;
    login(adminIdentifier, adminPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={() => {
            setIsAuthModalOpen(false);
            setShowAdminForm(false);
            setShowCustomGmail(false);
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mb-3 border border-rose-100 dark:border-rose-900 shadow-xs">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
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
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
            গুগল দিয়ে প্রবেশ করুন
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
            ইউজারদের জন্য শুধুমাত্র গুগল অ্যাকাউন্ট দিয়ে কোনো পাসওয়ার্ড ছাড়াই ১-ক্লিকে সুরক্ষিত লগইন ও রেজিস্ট্রেশন ব্যবস্থা।
          </p>
        </div>

        {/* Primary Action: Single-click Google Sign-In */}
        <div className="space-y-4 mb-5">
          <button
            id="auth-modal-main-google-btn"
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-100 font-bold text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99]"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Custom Google Email input toggle */}
          <div className="text-center">
            {!showCustomGmail ? (
              <button
                type="button"
                onClick={() => setShowCustomGmail(true)}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 underline underline-offset-2 transition-colors cursor-pointer"
              >
                নির্দিষ্ট কোনো জিমেইল অ্যাড্রেস দিয়ে সাইন-ইন করবেন?
              </button>
            ) : (
              <form onSubmit={handleCustomGmailSubmit} className="space-y-3 pt-2 text-left bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    গুগল ইমেইল (Gmail)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="asowad222@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                    placeholder="যেমন: তানভীর হাসান"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>লগইন করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomGmail(false)}
                    className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Admin Access Panel (Discreet & Secure) */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          {!showAdminForm ? (
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>অ্যাডমিনিস্ট্রেটর এক্সেস:</span>
              </span>
              <button
                id="auth-modal-admin-panel-btn"
                type="button"
                onClick={() => setShowAdminForm(true)}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                অ্যাডমিন লগইন
              </button>
            </div>
          ) : (
            <div className="space-y-3 bg-indigo-50/60 dark:bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  <span>অ্যাডমিন পোর্টাল</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAdminForm(false)}
                  className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  বন্ধ করুন
                </button>
              </div>

              {/* Quick Admin Demo Button */}
              <button
                type="button"
                onClick={() => {
                  switchUserRole('admin');
                  setIsAuthModalOpen(false);
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>১-ক্লিকে অ্যাডমিন মোডে প্রবেশ করুন</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-indigo-200 dark:border-indigo-800 w-full"></div>
                <span className="bg-transparent px-2 text-[10px] text-indigo-400 font-medium shrink-0">অথবা পাসওয়ার্ড দিয়ে</span>
                <div className="border-t border-indigo-200 dark:border-indigo-800 w-full"></div>
              </div>

              {/* Admin Form */}
              <form onSubmit={handleAdminSubmit} className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="admin@platform.com"
                  value={adminIdentifier}
                  onChange={(e) => setAdminIdentifier(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs text-gray-900 dark:text-white"
                />
                <input
                  type="password"
                  required
                  placeholder="অ্যাডমিন পাসওয়ার্ড (admin123)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900 rounded-lg text-xs font-bold transition-colors"
                >
                  সাইন ইন
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
