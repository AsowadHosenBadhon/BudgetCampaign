import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { HomePage } from './components/user/HomePage';
import { ServicesPage } from './components/user/ServicesPage';
import { OrdersPage } from './components/user/OrdersPage';
import { ProfilePage } from './components/user/ProfilePage';
import { PurchaseModal } from './components/user/PurchaseModal';
import { PostDetailModal } from './components/user/PostDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { PurchaseAuthPromptModal } from './components/auth/PurchaseAuthPromptModal';
import { AdminLayout } from './components/admin/AdminLayout';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    isAdminMode, 
    isAuthModalOpen, 
    isPurchaseAuthPromptOpen,
    selectedServiceForPurchase,
    selectedPostForDetail,
    isDarkMode 
  } = useApp();

  // Keep dark class on html element synced
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // If in Admin Mode, render the full Admin Panel experience
  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors">
        <AdminLayout />
        <ToastContainer />
      </div>
    );
  }

  // User Section (Frontend)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <Header />

      {/* Main Tab Views */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'services' && <ServicesPage />}
        {activeTab === 'orders' && <OrdersPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </main>

      {/* Persistent Bottom Navigation Menu */}
      <BottomNav />

      {/* Interactive Modals */}
      {isAuthModalOpen && <AuthModal />}
      {isPurchaseAuthPromptOpen && <PurchaseAuthPromptModal />}
      {selectedServiceForPurchase && <PurchaseModal />}
      {selectedPostForDetail && <PostDetailModal />}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
