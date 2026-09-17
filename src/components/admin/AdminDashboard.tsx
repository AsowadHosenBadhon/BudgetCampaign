import React from 'react';
import { 
  Users, ShoppingBag, Clock, CheckCircle2, 
  XCircle, DollarSign, TrendingUp, ArrowRight, Eye, Check, X 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    users, 
    orders, 
    setAdminActiveTab, 
    updateOrderStatus 
  } = useApp();

  // Statistics calculation as requested:
  // - Total Users
  // - Total Orders
  // - Pending Orders
  // - Approved Orders
  // - Rejected Orders
  // - Total Revenue
  // - Recent Orders

  const totalUsers = users.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const approvedOrders = orders.filter((o) => o.status === 'approved').length;
  const rejectedOrders = orders.filter((o) => o.status === 'rejected').length;

  // Revenue from approved orders
  const totalRevenue = orders
    .filter((o) => o.status === 'approved')
    .reduce((sum, o) => sum + o.paidAmount, 0);

  // Recent 6 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            অ্যাডমিন ড্যাশবোর্ড (Admin Overview)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            রিয়েল-টাইম অর্ডার স্ট্যাটিস্টিকস, আয় এবং ইউজার কার্যক্রমের সামগ্রিক বিবরণ।
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            লাইভ সিস্টেম চালু
          </span>
        </div>
      </div>

      {/* Required 6 Primary Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* 1. Total Users */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Total Users
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {totalUsers}
            </div>
            <span className="text-[10px] text-gray-400">নিবন্ধিত গ্রাহক</span>
          </div>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Total Orders
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {totalOrders}
            </div>
            <span className="text-[10px] text-gray-400">সকল অর্ডার</span>
          </div>
        </div>

        {/* 3. Pending Orders */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/80 shadow-sm flex flex-col justify-between bg-amber-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase">
              Pending Orders
            </span>
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
              {pendingOrders}
            </div>
            <span className="text-[10px] text-amber-600/80">ভেরিফিকেশন প্রয়োজন</span>
          </div>
        </div>

        {/* 4. Approved Orders */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 shadow-sm flex flex-col justify-between bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
              Approved
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {approvedOrders}
            </div>
            <span className="text-[10px] text-emerald-600/80">অনুমোদিত অর্ডার</span>
          </div>
        </div>

        {/* 5. Rejected Orders */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-rose-200 dark:border-rose-800/80 shadow-sm flex flex-col justify-between bg-rose-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase">
              Rejected
            </span>
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
              {rejectedOrders}
            </div>
            <span className="text-[10px] text-rose-600/80">বাতিলকৃত</span>
          </div>
        </div>

        {/* 6. Total Revenue */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
              ৳{totalRevenue.toLocaleString()}
            </div>
            <span className="text-[10px] text-gray-400">মোট উপার্জিত আয়</span>
          </div>
        </div>

      </div>

      {/* Quick Action Alerts for Pending Orders */}
      {pendingOrders > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                {pendingOrders} টি নতুন অর্ডার ভেরিফিকেশনের অপেক্ষায় আছে!
              </h4>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                গ্রাহকদের প্রেরিত Transaction ID ও পেমেন্ট স্ক্রিনশট যাচাই করে দ্রুত Approve করুন।
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminActiveTab('orders')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
          >
            অর্ডার রিভিউ করুন →
          </button>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Orders (সাম্প্রতিক অর্ডারসমূহ)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              সর্বশেষ প্রাপ্ত অর্ডার ও দ্রুত স্ট্যাটাস পরিবর্তন অপশন।
            </p>
          </div>
          <button
            onClick={() => setAdminActiveTab('orders')}
            className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
          >
            <span>সকল অর্ডার দেখুন ({totalOrders})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400">
            এখনও কোন অর্ডার নেই।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">গ্রাহক</th>
                  <th className="py-3 px-3">সার্ভিস</th>
                  <th className="py-3 px-3">TrxID & মেথড</th>
                  <th className="py-3 px-3">মূল্য</th>
                  <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                  <th className="py-3 px-3 text-right">কুইক অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 px-3 font-mono font-bold text-gray-900 dark:text-white">
                      {ord.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900 dark:text-white">{ord.userName}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{ord.userPhone}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-800 dark:text-gray-200">
                      {ord.serviceName}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{ord.transactionId}</span>
                      <span className="text-[10px] text-gray-400 block">{ord.paymentMethod}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                      ৳{ord.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : ord.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {ord.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'approved', 'পেমেন্ট অনুমোদিত হয়েছে।')}
                            title="Approve Order"
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'rejected', 'পেমেন্ট তথ্যে অসঙ্গতি রয়েছে।')}
                            title="Reject Order"
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAdminActiveTab('orders')}
                          className="text-[11px] text-indigo-600 hover:underline font-semibold"
                        >
                          বিস্তারিত
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
