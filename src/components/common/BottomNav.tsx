import React from 'react';
import { Home, Briefcase, ShoppingBag, User } from 'lucide-react';
import { useApp, UserTab } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, orders, currentUser, isAdminMode } = useApp();

  // If in admin mode, bottom nav still allows quick return or preview, or hidden if desired.
  // The requirement says: "ওয়েবসাইটের নিচে সব সময় নিম্নলিখিত বাটনগুলো থাকবে: Home, Services, Orders, Profile"
  
  const pendingCount = currentUser 
    ? orders.filter(o => o.userId === currentUser.id && o.status === 'pending').length 
    : 0;

  const navItems: { id: UserTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'services',
      label: 'Services',
      icon: Briefcase,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav 
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = !isAdminMode && activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
              }}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
                isActive 
                  ? 'text-rose-600 dark:text-rose-400 font-bold scale-105' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-gray-900 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 bg-rose-600 dark:bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
