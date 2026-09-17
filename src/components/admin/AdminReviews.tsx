import React, { useState } from 'react';
import { 
  Star, Check, Trash2, MessageSquare, 
  CheckCircle2, XCircle, Search, UserCheck,
  EyeOff, RotateCcw, Package
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Review } from '../../types';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const AdminReviews: React.FC = () => {
  const { reviews, approveReview, rejectReview, deleteReview } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'approved' && !r.isApproved) return false;
    if (filter === 'pending' && r.isApproved) return false;
    const q = searchQuery.toLowerCase();
    return (
      r.userName.toLowerCase().includes(q) ||
      r.serviceName.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            Customer Reviews Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            গ্রাহকদের দেওয়া মতামত ও রিভিউ যাচাই করে পাবলিক হোমপেজে অনুমোদন (Approve) বা মুছুন (Delete)।
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold border border-emerald-200 dark:border-emerald-800">
            অনুমোদিত: {reviews.filter(r => r.isApproved).length}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 font-bold border border-amber-200 dark:border-amber-800">
            পেন্ডিং: {reviews.filter(r => !r.isApproved).length}
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="গ্রাহকের নাম বা রিভিউ খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {[
            { id: 'all', label: 'সবগুলো' },
            { id: 'approved', label: 'Approved' },
            { id: 'pending', label: 'Pending' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === f.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Cards List */}
      {filteredReviews.length === 0 ? (
        <div className="py-16 text-center text-xs text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          কোন রিভিউ পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header with user and rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={rev.userName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">
                        {rev.userName}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {rev.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Service Name & Order ID */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                    সার্ভিস: {rev.serviceName}
                  </span>
                  {rev.orderId && (
                    <span className="text-[10px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      <span>অর্ডার: #{rev.orderId}</span>
                    </span>
                  )}
                </div>

                {/* Comment */}
                <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-700/30 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  "{rev.comment}"
                </p>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  rev.isApproved
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {rev.isApproved ? 'Approved (পাবলিক হোমপেজে দৃশ্যমান)' : 'Pending Review (পেন্ডিং)'}
                </span>

                <div className="flex items-center gap-2">
                  {!rev.isApproved ? (
                    <button
                      id={`approve-review-btn-${rev.id}`}
                      onClick={() => approveReview(rev.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>অনুমোদন করুন (Approve)</span>
                    </button>
                  ) : (
                    <button
                      id={`unapprove-review-btn-${rev.id}`}
                      onClick={() => rejectReview(rev.id)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="হোমপেজ থেকে রিভিউটি অপ্রকাশিত (Pending) করুন"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>অপ্রকাশিত করুন (Unpublish)</span>
                    </button>
                  )}

                  <button
                    id={`delete-review-btn-${rev.id}`}
                    onClick={() => setReviewToDelete(rev)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                    title="রিভিউ ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={() => {
          if (reviewToDelete) {
            deleteReview(reviewToDelete.id);
            setReviewToDelete(null);
          }
        }}
        title="রিভিউ মুছে ফেলুন"
        itemName={reviewToDelete ? `${reviewToDelete.userName}: "${reviewToDelete.comment.substring(0, 40)}..."` : undefined}
        description={`আপনি কি নিশ্চিতভাবে এই রিভিউটি মুছে ফেলতে চান?`}
        confirmText="হ্যাঁ, রিভিউ মুছুন"
        cancelText="বাতিল"
        idPrefix="review-delete"
      />

    </div>
  );
};
