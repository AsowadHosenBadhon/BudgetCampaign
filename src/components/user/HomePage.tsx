import React, { useState } from 'react';
import { 
  Play, Star, ThumbsUp, MessageSquare, ArrowRight, 
  Sparkles, CheckCircle, Flame, Bookmark, Clock, Eye,
  ShoppingBag, Package, Layers, ShieldCheck, AlertCircle, CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Service, Order } from '../../types';

export const HomePage: React.FC = () => {
  const { 
    videoConfig, 
    reviews, 
    orders,
    addReview, 
    currentUser, 
    setIsAuthModalOpen, 
    setActiveTab, 
    services,
    initiatePurchase,
    showToast
  } = useApp();

  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

  // Review submission modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewOrderId, setReviewOrderId] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');

  // Packages selected by Admin
  const popularPackages = services.filter(s => s.isPopular && s.status !== 'inactive');
  const recommendedPackages = services.filter(s => s.isRecommended && s.status !== 'inactive');
  
  // Public reviews: approved only
  const approvedReviews = reviews.filter(r => r.isApproved);

  // Confirmed orders eligible for review (completed or approved/processing/running)
  const confirmedUserOrders = orders.filter(
    (o) => o.userId === currentUser?.id && ['completed', 'approved', 'processing', 'running'].includes(o.status)
  );

  const handleOpenReviewModal = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (confirmedUserOrders.length === 0) {
      showToast('শুধুমাত্র নিশ্চিত (Confirmed/Completed) অর্ডার সম্পন্নকারী গ্রাহকগণ রিভিউ দিতে পারেন। আপনার কোনো কনফার্মড অর্ডার পাওয়া যায়নি।', 'warning');
      return;
    }

    // Default to the first confirmed order ID
    if (!reviewOrderId && confirmedUserOrders.length > 0) {
      setReviewOrderId(confirmedUserOrders[0].id);
    }
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (confirmedUserOrders.length === 0) {
      showToast('শুধুমাত্র নিশ্চিত ও সফল অর্ডারকারী গ্রাহকগণ রিভিউ দিতে পারবেন।', 'error');
      return;
    }

    const selectedOrder = confirmedUserOrders.find((o) => o.id === reviewOrderId) || confirmedUserOrders[0];
    if (!selectedOrder) {
      showToast('অনুগ্রহ করে একটি নিশ্চিত অর্ডার নির্বাচন করুন।', 'warning');
      return;
    }

    if (!reviewComment.trim()) return;

    addReview({
      serviceName: selectedOrder.serviceName,
      serviceId: selectedOrder.serviceId,
      orderId: selectedOrder.id,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewComment('');
    setIsReviewModalOpen(false);
  };

  // Helper to extract YouTube video ID
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : 'dQw4w9WgXcQ';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  return (
    <div className="pb-24 pt-4 sm:pt-6 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Featured YouTube Video Thumbnail Section (Top) */}
      <section className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-gray-900 group">
        <div className="relative aspect-video sm:aspect-[21/9] w-full flex items-center justify-center overflow-hidden">
          {isPlayingVideo ? (
            <iframe
              src={getYoutubeEmbedUrl(videoConfig.youtubeUrl)}
              title={videoConfig.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {/* Background Thumbnail Image */}
              <img
                src={videoConfig.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'}
                alt={videoConfig.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-black/30" />

              {/* Center Play Button */}
              <button
                id="featured-video-play-btn"
                onClick={() => setIsPlayingVideo(true)}
                className="absolute z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 hover:scale-110 transition-all duration-300 ring-8 ring-white/20 cursor-pointer"
                title="ভিডিও প্লে করুন"
              >
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
              </button>

              {/* Video Info Overlay */}
              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600/90 text-white backdrop-blur-md mb-2">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Featured Video</span>
                </div>
                <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white leading-tight max-w-2xl text-shadow">
                  {videoConfig.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-xl line-clamp-2">
                  {videoConfig.subtitle}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Quick Services Showcase Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-rose-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">
              আপনার ব্যবসার প্রবৃদ্ধি বাড়াতে প্রস্তুত?
            </h3>
            <p className="text-xs sm:text-sm text-rose-100">
              আমাদের প্রফেশনাল ফেসবুক এডস, ওয়েবসাইট ও এসইও সার্ভিস দেখুন এবং এখনই অর্ডার করুন।
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('services')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-gray-900 hover:bg-rose-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <span>সকল সার্ভিস দেখুন</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Section: Popular Package (জনপ্রিয় প্যাকেজসমূহ) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Popular Package
              </h2>
            </div>
          </div>
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full">
            {popularPackages.length} টি প্যাকেজ
          </span>
        </div>

        {popularPackages.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
            <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              বর্তমানে কোনো Popular Package নির্বাচিত নেই।
            </p>
            <p className="text-xs text-gray-400 mt-1">
              অ্যাডমিন প্যানেল থেকে যেকোনো সার্ভিসকে Popular Package হিসেবে মার্ক করা যাবে।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {popularPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/90 overflow-hidden shadow-sm hover:shadow-lg hover:border-rose-400 dark:hover:border-rose-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={(pkg.images && pkg.images.length > 0) ? pkg.images[0] : (pkg.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80')}
                      alt={pkg.nameBn || pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/70 text-white backdrop-blur-md">
                      {pkg.categoryBn || pkg.category}
                    </span>

                    {pkg.images && pkg.images.length > 1 && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 backdrop-blur-md flex items-center gap-1 shadow-xs">
                        <Layers className="w-3 h-3 text-rose-500" />
                        <span>{pkg.images.length} ছবি</span>
                      </span>
                    )}

                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-medium text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      <Clock className="w-3 h-3" />
                      <span>ডেলিভারি: {pkg.deliveryTime || '১-৩ দিন'}</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
                      {pkg.nameBn || pkg.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                      {pkg.descriptionBn || pkg.description}
                    </p>

                    {pkg.customFields && pkg.customFields.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>প্রসেসিং-এ {pkg.customFields.length}টি তথ্য ফর্ম প্রয়োজন</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-gray-400">মূল্য</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400">
                        ৳{pkg.price.toLocaleString()}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ৳{pkg.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => initiatePurchase(pkg)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Purchase</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Section: Recommended Package (সুপারিশকৃত প্যাকেজসমূহ) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Recommended Package
              </h2>
            </div>
          </div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
            {recommendedPackages.length} টি প্যাকেজ
          </span>
        </div>

        {recommendedPackages.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
            <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              বর্তমানে কোনো Recommended Package নির্বাচিত নেই।
            </p>
            <p className="text-xs text-gray-400 mt-1">
              অ্যাডমিন প্যানেল থেকে যেকোনো সার্ভিসকে Recommended Package হিসেবে নির্বাচন করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recommendedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/90 overflow-hidden shadow-sm hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={(pkg.images && pkg.images.length > 0) ? pkg.images[0] : (pkg.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80')}
                      alt={pkg.nameBn || pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-900/80 text-white backdrop-blur-md">
                      {pkg.categoryBn || pkg.category}
                    </span>

                    {pkg.images && pkg.images.length > 1 && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 backdrop-blur-md flex items-center gap-1 shadow-xs">
                        <Layers className="w-3 h-3 text-indigo-500" />
                        <span>{pkg.images.length} ছবি</span>
                      </span>
                    )}

                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] font-medium text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      <Clock className="w-3 h-3" />
                      <span>ডেলিভারি: {pkg.deliveryTime || '১-৩ দিন'}</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {pkg.nameBn || pkg.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                      {pkg.descriptionBn || pkg.description}
                    </p>

                    {pkg.customFields && pkg.customFields.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>প্রসেসিং-এ {pkg.customFields.length}টি তথ্য ফর্ম প্রয়োজন</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-gray-400">মূল্য</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                        ৳{pkg.price.toLocaleString()}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ৳{pkg.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => initiatePurchase(pkg)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Purchase</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Section: User Reviews / Customer Reviews */}
      <section className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Customer Reviews / গ্রাহক মতামত
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                আমাদের সেবা গ্রহণকারী সন্তুষ্ট গ্রাহকদের বাস্তব প্রতিক্রিয়া
              </span>
            </div>
          </div>

          <button
            id="open-review-modal-btn"
            onClick={handleOpenReviewModal}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>মতামত বা রিভিউ দিন</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.date}</span>
                </div>

                {/* Service Tag */}
                <span className="inline-block text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded mb-2">
                  {rev.serviceName}
                </span>

                {/* Review comment */}
                <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Info */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center gap-2.5">
                <img
                  src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={rev.userName}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    <span>{rev.userName}</span>
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                  </h4>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ভেরিফাইড কাস্টমার
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Write Review Modal - For Confirmed Order Buyers Only */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded bg-rose-100 dark:bg-rose-950/50 text-rose-600">
                <Star className="w-4 h-4 fill-current" />
              </span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                আপনার মূল্যবান রিভিউ দিন
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              শুধুমাত্র নিশ্চিত (Confirmed) অর্ডার গ্রহণকারী গ্রাহক হিসেবে আপনার অভিজ্ঞতা জানান
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Confirmed Order Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  আপনার নিশ্চিত অর্ডার নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={reviewOrderId}
                  onChange={(e) => setReviewOrderId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {confirmedUserOrders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      #{ord.id} - {ord.serviceName} ({ord.status.toUpperCase()})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  ভেরিফাইড পারচেজ অর্ডার নিশ্চিত করা হয়েছে
                </span>
              </div>

              {/* Star selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  রেটিং সিলেক্ট করুন (Rating)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-2xl hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= reviewRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-2">
                    {reviewRating} / ৫ স্টার
                  </span>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  আপনার মন্তব্য লিখুন
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="সার্ভিসের মান, ডেলিভারি টাইম এবং সাপোর্ট টিম সম্পর্কে আপনার মতামত লিখুন..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
                >
                  রিভিউ জমা দিন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
