import React, { useState } from 'react';
import { 
  Search, ShoppingBag, Filter, Clock, Sparkles, 
  Layers, ShieldCheck, Tag, ArrowRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Service } from '../../types';

export const ServicesPage: React.FC = () => {
  const { services, categories, initiatePurchase } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter services by category and search
  const filteredServices = services.filter((srv) => {
    // If service is marked inactive, don't show to public
    if (srv.status === 'inactive' || srv.isActive === false) return false;

    const matchesCategory = 
      selectedCategory === 'All' || 
      srv.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (srv.categoryId && srv.categoryId === selectedCategory);

    const matchesSearch = 
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (srv.nameBn && srv.nameBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (srv.description && srv.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (srv.descriptionBn && srv.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-24 pt-4 sm:pt-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header & Search Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-850 dark:to-black text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ডিজিটাল সার্ভিস মার্কেটপ্লেস</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              প্রিমিয়াম ডিজিটাল সার্ভিসেস ও প্যাকেজ
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
              আপনার সোশ্যাল মিডিয়া গ্রোথ, গেমিং সার্ভিস ও কাস্টম ডেভেলপমেন্টের জন্য বিশ্বস্ত সমাধান। নিরাপদে অর্ডার করুন এবং দ্রুত ডেলিভারি গ্রহণ করুন।
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80">
            <div className="relative">
              <input
                type="text"
                placeholder="সার্ভিস বা প্যাকেজ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-gray-900 dark:focus:text-white border border-white/20 focus:border-rose-500 rounded-2xl text-xs sm:text-sm placeholder-gray-400 focus:placeholder-gray-500 focus:outline-none transition-all shadow-inner backdrop-blur-md"
              />
              <Search className="w-4 h-4 text-gray-300 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Requirement 4: Category filter on User Panel) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'All'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>সকল ক্যাটাগরি</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
            {services.filter(s => s.status !== 'inactive').length}
          </span>
        </button>

        {categories.map((cat) => {
          const count = services.filter(
            s => (s.categoryId === cat.id || s.category.toLowerCase() === cat.name.toLowerCase()) && s.status !== 'inactive'
          ).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400'
              }`}
            >
              <span>{cat.nameBn || cat.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Services Grid (Requirement 5: Modern Card Layout) */}
      {filteredServices.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-gray-800/60 rounded-3xl border border-gray-200 dark:border-gray-700/80 shadow-sm p-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 mx-auto mb-4">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            কোন সার্ভিস খুঁজে পাওয়া যায়নি
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            অন্য কোনো কিওয়ার্ড লিখে অনুসন্ধান করুন অথবা অন্য কোনো ক্যাটাগরি নির্বাচন করুন।
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
            >
              ফিল্টার রিসেট করুন
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const displayImage = 
              (service.images && service.images.length > 0) 
                ? service.images[0] 
                : (service.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80');

            return (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700/80 shadow-sm hover:shadow-xl hover:border-rose-300 dark:hover:border-rose-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* 1. Service Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={displayImage}
                      alt={service.nameBn || service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                      <span className="px-3 py-1 rounded-xl text-[11px] font-bold bg-black/60 text-white backdrop-blur-md shadow-xs">
                        {service.categoryBn || service.category}
                      </span>
                      {service.badge && (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-rose-600 text-white shadow-xs">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {/* Multiple images indicator */}
                    {service.images && service.images.length > 1 && (
                      <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-black/60 text-white backdrop-blur-md flex items-center gap-1 shadow-xs">
                        <Layers className="w-3 h-3 text-rose-400" />
                        <span>{service.images.length} ছবি</span>
                      </span>
                    )}

                    {/* Delivery duration info */}
                    <div className="absolute bottom-3 left-3.5 flex items-center gap-1 text-[11px] font-semibold text-white/95 bg-black/40 px-2.5 py-0.5 rounded-lg backdrop-blur-xs">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>ডেলিভারি: {service.deliveryTime || service.duration || '১-৩ দিন'}</span>
                    </div>
                  </div>

                  {/* 2. Service Title & Short Description */}
                  <div className="p-5 space-y-2.5">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-snug line-clamp-1">
                        {service.nameBn || service.name}
                      </h2>
                      {service.nameBn && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5 font-medium">
                          {service.name}
                        </p>
                      )}
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {service.descriptionBn || service.description}
                    </p>

                    {/* Custom Form Fields notice if required */}
                    {service.customFields && service.customFields.length > 0 && (
                      <div className="pt-2 flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>প্রসেসিং-এ {service.customFields.length}টি কাস্টম তথ্য দিতে হবে</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Price & Purchase Button (Card Footer) */}
                <div className="p-5 pt-3 border-t border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/40 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      সার্ভিস মূল্য
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-xl font-black text-rose-600 dark:text-rose-400">
                        ৳{service.price.toLocaleString()}
                      </span>
                      {service.originalPrice && service.originalPrice > service.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ৳{service.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <button
                    id={`purchase-btn-${service.id}`}
                    onClick={() => initiatePurchase(service)}
                    className="px-4 sm:px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-rose-600/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Purchase</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
