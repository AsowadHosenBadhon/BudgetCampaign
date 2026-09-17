import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, CreditCard, ClipboardList, 
  Users, Video, Star, ArrowLeft, Shield, Menu, X, Sun, Moon,
  Tags, Palette
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminBranding } from './AdminBranding';
import { AdminPayments } from './AdminPayments';
import { AdminOrders } from './AdminOrders';
import { AdminUsers } from './AdminUsers';
import { AdminPosts } from './AdminPosts';
import { AdminReviews } from './AdminReviews';

export const AdminLayout: React.FC = () => {
  const { 
    adminActiveTab, 
    setAdminActiveTab, 
    setIsAdminMode, 
    orders, 
    reviews,
    theme, 
    toggleTheme,
    currentUser 
  } = useApp();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const pendingReviewsCount = reviews.filter((r) => !r.isApproved).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'ড্যাশবোর্ড',
      sublabel: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'products',
      label: 'প্রোডাক্ট ও সার্ভিস',
      sublabel: 'Product Management',
      icon: ShoppingBag,
    },
    {
      id: 'categories',
      label: 'ক্যাটাগরি সমূহ',
      sublabel: 'Category Management',
      icon: Tags,
    },
    {
      id: 'branding',
      label: 'ব্র্যান্ডিং ও লোগো',
      sublabel: 'Website Settings',
      icon: Palette,
    },
    {
      id: 'payments',
      label: 'পেমেন্ট মেথড',
      sublabel: 'Payment Methods',
      icon: CreditCard,
    },
    {
      id: 'orders',
      label: 'অর্ডার ম্যানেজমেন্ট',
      sublabel: 'Order Management',
      icon: ClipboardList,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'users',
      label: 'ইউজার ম্যানেজমেন্ট',
      sublabel: 'User Management',
      icon: Users,
    },
    {
      id: 'posts',
      label: 'পোস্ট ও ভিডিও',
      sublabel: 'Posts & Video',
      icon: Video,
    },
    {
      id: 'reviews',
      label: 'কাস্টমার রিভিউ',
      sublabel: 'Review Management',
      icon: Star,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row transition-colors">
      
      {/* Mobile Admin Top Bar */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1.5 font-black text-rose-600 dark:text-rose-400">
            <Shield className="w-5 h-5" />
            <span className="text-sm">অ্যাডমিন প্যানেল</span>
          </div>
        </div>

        <button
          onClick={() => setIsAdminMode(false)}
          className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-rose-600 flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ইউজার সাইট</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 md:w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700/80 flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-black text-base text-gray-900 dark:text-white leading-tight">
                  Admin Panel
                </h1>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                  Service Selling
                </span>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminActiveTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminActiveTab(item.id as any);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <div>{item.label}</div>
                      <div className={`text-[10px] font-normal ${isActive ? 'text-rose-100' : 'text-gray-400'}`}>
                        {item.sublabel}
                      </div>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white ${item.badgeColor || 'bg-rose-500'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switch back to User Section */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700/80 space-y-3">
          <button
            onClick={() => setIsAdminMode(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-rose-500" />
            <span>ইউজার প্যানেলে ফিরে যান</span>
          </button>

          {currentUser && (
            <div className="flex items-center gap-2.5 px-2 py-1">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-rose-500"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold uppercase">
                  Super Admin
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto min-h-screen">
        {adminActiveTab === 'dashboard' && <AdminDashboard />}
        {adminActiveTab === 'products' && <AdminProducts />}
        {adminActiveTab === 'categories' && <AdminCategories />}
        {adminActiveTab === 'branding' && <AdminBranding />}
        {adminActiveTab === 'payments' && <AdminPayments />}
        {adminActiveTab === 'orders' && <AdminOrders />}
        {adminActiveTab === 'users' && <AdminUsers />}
        {adminActiveTab === 'posts' && <AdminPosts />}
        {adminActiveTab === 'reviews' && <AdminReviews />}
      </main>

    </div>
  );
};
