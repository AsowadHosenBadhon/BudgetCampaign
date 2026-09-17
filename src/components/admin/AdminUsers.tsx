import React, { useState } from 'react';
import { 
  Users, Search, Shield, UserCheck, UserX, 
  Ban, AlertTriangle, Eye, Mail, Phone, Calendar, ShoppingBag, Trash2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, UserStatus } from '../../types';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const AdminUsers: React.FC = () => {
  const { users, updateUserStatus, deleteUser, currentUser, orders } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.status.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Active
          </span>
        );
      case 'deactivated':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            Deactivated
          </span>
        );
      case 'suspended':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Suspended
          </span>
        );
      case 'banned':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            Banned
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            User Management & Access Control
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            সকল ব্যবহারকারীর প্রোফাইল দেখুন, অ্যাকাউন্ট সক্রিয়, স্থগিত বা ব্যান করুন।
          </p>
        </div>

        <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
          মোট ইউজার: {users.length} জন
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <input
          type="text"
          placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="py-3.5 px-4">ইউজার (User Profile)</th>
                <th className="py-3.5 px-4">যোগাযোগ (Contact)</th>
                <th className="py-3.5 px-4">অর্ডার হিস্ট্রি</th>
                <th className="py-3.5 px-4">যোগদান তারিখ</th>
                <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-right">স্ট্যাটাস অ্যাকশন (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {filteredUsers.map((user) => {
                const userOrdersList = orders.filter((o) => o.userId === user.id);
                const userSpent = userOrdersList
                  .filter((o) => o.status === 'approved')
                  .reduce((s, o) => s + o.paidAmount, 0);

                return (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    
                    {/* User Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200"
                        />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.role === 'admin' && (
                              <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 text-[10px] px-1.5 py-0.2 rounded font-bold">
                                Admin
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => setSelectedUserForProfile(user)}
                            className="text-[10px] text-rose-600 hover:underline flex items-center gap-0.5 mt-0.5 font-medium"
                          >
                            <Eye className="w-2.5 h-2.5" /> প্রোফাইল দেখুন
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-gray-900 dark:text-white text-xs">
                        {user.phone}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {user.email}
                      </div>
                    </td>

                    {/* Order History summary */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {userOrdersList.length} টি অর্ডার
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        ৳{userSpent.toLocaleString()} খরচ
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {user.joinedDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(user.status)}
                    </td>

                    {/* Actions: Activate, Deactivate, Suspend, Ban */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {user.status !== 'active' && (
                          <button
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                            title="Activate Account"
                          >
                            Activate
                          </button>
                        )}

                        {user.status !== 'deactivated' && (
                          <button
                            onClick={() => updateUserStatus(user.id, 'deactivated')}
                            className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-colors"
                            title="Deactivate Account"
                          >
                            Deactivate
                          </button>
                        )}

                        {user.status !== 'suspended' && (
                          <button
                            onClick={() => updateUserStatus(user.id, 'suspended')}
                            className="px-2 py-1 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 rounded-lg text-[10px] font-bold hover:bg-amber-100 transition-colors"
                            title="Suspend Account"
                          >
                            Suspend
                          </button>
                        )}

                        {user.status !== 'banned' && (
                          <button
                            onClick={() => updateUserStatus(user.id, 'banned')}
                            className="px-2 py-1 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 rounded-lg text-[10px] font-bold hover:bg-rose-100 transition-colors"
                            title="Ban Account"
                          >
                            Ban
                          </button>
                        )}

                        {currentUser?.id !== user.id && (
                          <button
                            id={`delete-user-btn-${user.id}`}
                            onClick={() => setUserToDelete(user)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors ml-1"
                            title="ইউজার ডিলিট করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile View Modal */}
      {selectedUserForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                ব্যবহারকারী প্রোফাইল বিবরণ
              </h3>
              <button
                onClick={() => setSelectedUserForProfile(null)}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕ বন্ধ করুন
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedUserForProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={selectedUserForProfile.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-500/30"
              />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-base">
                  {selectedUserForProfile.name}
                </h4>
                <p className="text-xs text-gray-500">{selectedUserForProfile.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  {getStatusBadge(selectedUserForProfile.status)}
                  <span className="text-[10px] text-gray-400">রোল: {selectedUserForProfile.role}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">মোবাইল নাম্বার:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{selectedUserForProfile.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">যোগদানের তারিখ:</span>
                <span className="text-gray-700 dark:text-gray-300">{selectedUserForProfile.joinedDate}</span>
              </div>
              {selectedUserForProfile.bio && (
                <div className="pt-1 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 italic">
                  "{selectedUserForProfile.bio}"
                </div>
              )}
            </div>

            {/* Quick Status Setter inside Profile modal */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <label className="block text-[11px] font-semibold text-gray-500 mb-2">
                স্ট্যাটাস নির্ধারণ করুন:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['active', 'deactivated', 'suspended', 'banned'] as UserStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateUserStatus(selectedUserForProfile.id, st);
                      setSelectedUserForProfile(prev => prev ? { ...prev, status: st } : null);
                    }}
                    className={`py-1.5 text-[11px] font-bold rounded-lg capitalize border transition-all ${
                      selectedUserForProfile.status === st
                        ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            deleteUser(userToDelete.id);
            setUserToDelete(null);
          }
        }}
        title="ইউজার অ্যাকাউন্ট মুছে ফেলুন"
        itemName={userToDelete ? `${userToDelete.name} (${userToDelete.phone || userToDelete.email})` : undefined}
        description={`আপনি কি নিশ্চিতভাবে এই ব্যবহারকারী অ্যাকাউন্টটি মুছে ফেলতে চান? ইউজারের সমস্ত তথ্য সিস্টেম থেকে অপসারিত হবে।`}
        confirmText="হ্যাঁ, ইউজার মুছুন"
        cancelText="বাতিল"
        idPrefix="user-delete"
      />

    </div>
  );
};
