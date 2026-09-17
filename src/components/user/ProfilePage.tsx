import React, { useState } from 'react';
import { 
  User as UserIcon, Mail, Phone, Calendar, Shield, 
  Key, Lock, Edit3, History, CreditCard, ShoppingBag, 
  LogOut, CheckCircle, ArrowRight, ShieldAlert 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    logout, 
    updateUserProfile, 
    changePassword, 
    resetPasswordRequest,
    setIsAuthModalOpen,
    setActiveTab,
    setIsAdminMode,
    switchUserRole,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'history' | 'security'>('profile');

  // Edit Profile Form state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');

  React.useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditPhone(currentUser.phone || '');
      setEditEmail(currentUser.email || '');
      setEditBio(currentUser.bio || '');
    }
  }, [currentUser]);

  // Change Password Form state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Forgot password prompt in security
  const [forgotMsg, setForgotMsg] = useState('');

  if (!currentUser) {
    return (
      <div className="py-20 max-w-md mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          প্রোফাইল দেখতে লগইন করুন
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          আপনার ব্যক্তিগত তথ্য, পূর্ববর্তী লেনদেনের হিস্ট্রি ও পাসওয়ার্ড সেটিংস পরিচালনা করতে লগইন করুন।
        </p>
        <button
          id="profile-google-login-btn"
          onClick={() => setIsAuthModalOpen(true)}
          className="mt-6 px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-bold border border-gray-300 dark:border-gray-600 rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2.5 mx-auto"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>গুগল দিয়ে লগইন করুন</span>
        </button>
      </div>
    );
  }

  // User orders and transactions
  const userOrders = orders.filter((o) => o.userId === currentUser.id);
  const totalSpent = userOrders
    .filter((o) => o.status === 'approved')
    .reduce((sum, o) => sum + o.paidAmount, 0);

  const approvedCount = userOrders.filter((o) => o.status === 'approved').length;

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      bio: editBio.trim(),
    });
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!', 'error');
      return;
    }
    const res = changePassword(currentUser.id, oldPass, newPass);
    if (res.success) {
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleForgotPassword = () => {
    const res = resetPasswordRequest(currentUser.email);
    setForgotMsg(res.message);
  };

  return (
    <div className="pb-24 pt-4 sm:pt-6 space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Personal Information Hero Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700/80 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-rose-500/20"
            />
            <span className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase ${
              currentUser.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
            }`}>
              {currentUser.status}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {currentUser.name}
              </h1>
              {currentUser.role === 'admin' && (
                <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Admin
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {currentUser.email}
              </span>
              <span className={`flex items-center gap-1 font-mono ${!currentUser.phone ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full' : ''}`}>
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {currentUser.phone || 'মোবাইল নাম্বার যুক্ত নেই'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                যোগদান: {currentUser.joinedDate}
              </span>
            </div>

            {currentUser.bio && (
              <p className="text-xs text-gray-600 dark:text-gray-300 italic pt-1">
                "{currentUser.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setIsAdminMode(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>অ্যাডমিন ড্যাশবোর্ডে যান</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span>লগ আউট</span>
          </button>
        </div>

      </div>

      {/* Metrics Row (Total Spent, Total Orders, Approved) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-gray-400 uppercase">
            মোট অর্ডার
          </div>
          <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
            {userOrders.length}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-gray-400 uppercase">
            অনুমোদিত (Approved)
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {approvedCount}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm text-center">
          <div className="text-[11px] font-semibold text-gray-400 uppercase">
            মোট খরচ (Total Spent)
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            ৳{totalSpent.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Sub Tabs: Update Profile, Account Settings / Security, History */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 space-x-2">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'profile'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>প্রোফাইল আপডেট</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'history'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>লেনদেন ও হিস্ট্রি ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'security'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>পাসওয়ার্ড ও সিকিউরিটি</span>
        </button>
      </div>

      {/* 2. Sub Tab: Profile Information Edit */}
      {activeSubTab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm p-6 sm:p-8">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
            ব্যক্তিগত তথ্য আপডেট করুন (Update Profile)
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            আপনার নাম, মোবাইল নাম্বার বা যোগাযোগ সম্পর্কিত তথ্য পরিবর্তন করুন।
          </p>

          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                সম্পূর্ণ নাম (Full Name)
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  মোবাইল নাম্বার (Mobile Number)
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono"
                />
                {!currentUser.phone && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                    গুগল লগইনে মোবাইল নাম্বার খালি থাকে। সার্ভিস ও অর্ডারের আপডেটের জন্য নাম্বার যুক্ত করুন।
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ইমেইল এড্রেস (Email Address)
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                সংক্ষিপ্ত বিবরণ / বায়ো (Bio)
              </label>
              <textarea
                rows={2}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="যেমন: উদ্যোক্তা, ডিজিটাল কন্টেন্ট ক্রিয়েটর ইত্যাদি"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              পরিবর্তন সংরক্ষণ করুন
            </button>
          </form>
        </div>
      )}

      {/* 3. Sub Tab: History & Transactions */}
      {activeSubTab === 'history' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                লেনদেন ও পেমেন্ট হিস্ট্রি (Transactions History)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                আপনার সকল পূর্ববর্তী অর্ডার এবং পেমেন্ট রিসিট তালিকা।
              </p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <span>অর্ডার্স পেজে দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {userOrders.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              কোন পূর্ববর্তী ট্রানজেকশন হিস্ট্রি পাওয়া যায়নি।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">সার্ভিসের নাম</th>
                    <th className="py-3 px-3">মেথড ও TrxID</th>
                    <th className="py-3 px-3">তারিখ</th>
                    <th className="py-3 px-3 text-right">টাকার পরিমাণ</th>
                    <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                  {userOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900 dark:text-white">
                        {ord.id}
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-800 dark:text-gray-100">
                        {ord.serviceName}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{ord.transactionId}</span>
                        <span className="text-[10px] text-gray-400 block">{ord.paymentMethod}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                        {ord.createdAt}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-rose-600 dark:text-rose-400">
                        ৳{ord.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : ord.status === 'rejected'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. Sub Tab: Security & Password Settings */}
      {activeSubTab === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              অ্যাকাউন্ট সিকিউরিটি ও পাসওয়ার্ড পরিবর্তন
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              পাসওয়ার্ড নিয়মিত পরিবর্তন করে আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন।
            </p>
          </div>

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                বর্তমান পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                নতুন পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="কমপক্ষে ৪ ক্যারেক্টার"
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                নতুন পাসওয়ার্ড পুনরায় নিশ্চিত করুন
              </label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              পাসওয়ার্ড আপডেট করুন
            </button>
          </form>

          {/* Forgot Password Section */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
              পাসওয়ার্ড মনে নেই? (Forgot Password)
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              আপনার ইমেইলে ({currentUser.email}) রিসেট ভেরিফিকেশন পাঠানো হবে।
            </p>
            <button
              onClick={handleForgotPassword}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-xl"
            >
              রিসেট কোড পাঠান
            </button>
            {forgotMsg && (
              <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ✓ {forgotMsg}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
