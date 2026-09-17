import React from 'react';
import { 
  ShieldAlert, Sparkles, Moon, Sun, 
  User as UserIcon, LogOut, ArrowRightLeft 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    isAdminMode, 
    setIsAdminMode, 
    setActiveTab, 
    isDarkMode, 
    setIsDarkMode, 
    switchUserRole,
    setIsAuthModalOpen,
    setAuthModalMode,
    orders,
    branding
  } = useApp();

  const userPendingOrders = currentUser 
    ? orders.filter(o => o.userId === currentUser.id && o.status === 'pending').length
    : 0;

  const totalPendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            if (isAdminMode) {
              setIsAdminMode(false);
            }
            setActiveTab('home');
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {branding.logo ? (
            <img 
              src={branding.logo} 
              alt={branding.name} 
              className="w-10 h-10 rounded-xl object-cover shadow-md shadow-rose-500/10 group-hover:scale-105 transition-transform" 
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
                {branding.name || 'ShebaPoint'}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium hidden sm:block max-w-[200px] truncate">
              {branding.tagline || 'প্রিমিয়াম ডিজিটাল সার্ভিসেস ও সল্যুশন'}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Panel Switcher Button (User View <-> Admin Panel) */}
          <button
            id="panel-switcher-btn"
            onClick={() => {
              if (isAdminMode) {
                setIsAdminMode(false);
                setActiveTab('home');
              } else {
                switchUserRole('admin');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isAdminMode 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900'
            }`}
            title="Toggle between User View and Admin Panel"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isAdminMode ? 'ইউজার ভিউতে যান' : 'অ্যাডমিন প্যানেল'}
            </span>
            <span className="sm:hidden">
              {isAdminMode ? 'User View' : 'Admin'}
            </span>
            {isAdminMode && totalPendingOrders > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
                {totalPendingOrders}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={() => setIsDarkMode(prev => !prev)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Account / Auth trigger */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-gray-200 dark:border-gray-700">
              <div 
                onClick={() => {
                  if (isAdminMode) {
                    setIsAdminMode(false);
                  }
                  setActiveTab('profile');
                }}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="আমার প্রোফাইল দেখুন"
              >
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/30"
                />
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    {currentUser.role === 'admin' && (
                      <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 text-[10px] px-1.5 py-0.2 rounded font-bold">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">
                    {currentUser.phone || 'ফোন নাম্বার নেই'}
                  </div>
                </div>
              </div>

              {/* Quick switch between Demo User & Admin */}
              <button
                id="role-quick-toggle"
                onClick={() => {
                  if (currentUser.role === 'admin') {
                    switchUserRole('user');
                  } else {
                    switchUserRole('admin');
                  }
                }}
                className="text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                title={`বর্তমানে ${currentUser.role === 'admin' ? 'অ্যাডমিন' : 'কাস্টমার'} মোডে আছেন। ক্লিক করে পরিবর্তন করুন`}
              >
                <UserIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="header-google-login-btn"
                onClick={() => {
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-100 shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>গুগল দিয়ে প্রবেশ</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
