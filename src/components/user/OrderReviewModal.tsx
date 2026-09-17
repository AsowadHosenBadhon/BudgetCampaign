import React, { useState } from 'react';
import { Star, X, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

interface OrderReviewModalProps {
  order: Order;
  onClose: () => void;
  existingReview?: {
    rating: number;
    comment: string;
    isApproved: boolean;
    date: string;
  };
}

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  order,
  onClose,
  existingReview,
}) => {
  const { addReview, showToast } = useApp();
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('দয়া করে সার্ভিসটি সম্পর্কে আপনার মূল্যবান মতামত লিখুন', 'warning');
      return;
    }

    setIsSubmitting(true);
    addReview({
      serviceName: order.serviceName,
      serviceId: order.serviceId,
      orderId: order.id,
      rating,
      comment: comment.trim(),
    });

    setIsSubmitting(false);
    onClose();
  };

  const ratingDescriptions: Record<number, string> = {
    1: 'অত্যন্ত অসন্তোষজনক (Very Poor)',
    2: 'মোটামুটি (Poor)',
    3: 'ভালো (Average)',
    4: 'অনেক ভালো (Very Good)',
    5: 'অসাধারণ ও চমৎকার (Excellent)!',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0 shadow-sm">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                {existingReview ? 'আপনার প্রদত্ত রিভিউ' : 'সার্ভিসের রিভিউ ও মতামত দিন'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                অর্ডার আইডি: <span className="font-mono font-bold text-gray-700 dark:text-gray-300">#{order.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Details Context Card */}
        <div className="mt-4 p-3.5 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200/70 dark:border-gray-700/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">সম্পন্ন সার্ভিস</span>
            <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
              {order.serviceName}
            </div>
          </div>
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 shrink-0">
            ৳{order.paidAmount.toLocaleString()} • Delivered
          </span>
        </div>

        {/* If user already reviewed this order */}
        {existingReview ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${
                        s <= existingReview.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300 dark:text-gray-700'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300 ml-2">
                    {existingReview.rating} / 5
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  existingReview.isApproved
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {existingReview.isApproved ? 'Approved (পাবলিক)' : 'Under Admin Review (পেন্ডিং)'}
                </span>
              </div>

              <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-xl text-xs text-gray-700 dark:text-gray-200 italic border border-amber-100 dark:border-amber-900/40">
                "{existingReview.comment}"
              </div>

              <div className="mt-2 text-[10px] text-gray-400 text-right">
                রিভিউ তারিখ: {existingReview.date}
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              আপনার মতামতটি সংরক্ষিত রয়েছে। অ্যাডমিন প্যানেল থেকে যাচাই শেষে এটি মূল হোমপেজে প্রদর্শিত হবে।
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-xs transition-colors"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                সার্ভিসের মান অনুযায়ী স্টার রেটিং দিন <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-125 active:scale-95 transition-all cursor-pointer focus:outline-none"
                      title={`${star} Star`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          active
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                            : 'text-gray-300 dark:text-gray-700 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {ratingDescriptions[hoverRating || rating]}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                আপনার বিস্তারিত অভিজ্ঞতা ও মন্তব্য (Review Details) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="সার্ভিসের কোয়ালিটি, ডেলিভারি টাইম এবং সাপোর্ট নিয়ে আপনার ভালো বা মন্দ অভিজ্ঞতা লিখুন..."
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                আপনার রিভিউটি অ্যাডমিন প্যানেলে জমা হবে এবং অ্যাডমিন অনুমোদনের পর ওয়েবসাইটে সবার জন্য প্রদর্শিত হবে।
              </p>
            </div>

            {/* Submit buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>রিভিউ জমা দিন</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
