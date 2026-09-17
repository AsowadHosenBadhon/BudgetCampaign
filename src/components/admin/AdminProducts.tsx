import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Check, X, Search, 
  DollarSign, Tag, Clock, Layers, AlertCircle, 
  Star, Sparkles, Image as ImageIcon, Upload, 
  ListPlus, HelpCircle, CheckSquare, Eye, ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Service, FormField } from '../../types';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const AdminProducts: React.FC = () => {
  const { services, categories, addService, updateService, deleteService, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  
  // Quick Price Edit Modal
  const [priceEditService, setPriceEditService] = useState<Service | null>(null);
  const [quickPrice, setQuickPrice] = useState<number>(0);

  // Form states for Add/Edit
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Digital Marketing');
  const [description, setDescription] = useState('');
  const [featuresStr, setFeaturesStr] = useState('');
  const [price, setPrice] = useState<number>(1000);
  const [originalPrice, setOriginalPrice] = useState<number>(1500);
  const [duration, setDuration] = useState('৩-৫ দিন');
  const [badge, setBadge] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);

  // Images state
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Custom Form Builder state
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FormField['type']>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState('');

  const resetForm = () => {
    setName('');
    setNameBn('');
    setCategory(categories[0]?.name || 'Digital Marketing');
    setDescription('');
    setFeaturesStr('');
    setPrice(1000);
    setOriginalPrice(1500);
    setDuration('৩-৫ দিন');
    setBadge('');
    setIsActive(true);
    setIsPopular(false);
    setIsRecommended(false);
    setImages([]);
    setNewImageUrl('');
    setCustomFields([]);
    setEditingService(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setName(srv.name);
    setNameBn(srv.nameBn || '');
    setCategory(srv.category);
    setDescription(srv.description);
    setFeaturesStr(srv.features ? srv.features.join('\n') : '');
    setPrice(srv.price);
    setOriginalPrice(srv.originalPrice || srv.price);
    setDuration(srv.duration || '৩-৫ দিন');
    setBadge(srv.badge || '');
    setIsActive(srv.isActive);
    setIsPopular(!!srv.isPopular);
    setIsRecommended(!!srv.isRecommended);

    // Initialize images
    const existingImgs = srv.images && srv.images.length > 0 
      ? [...srv.images] 
      : srv.image 
      ? [srv.image] 
      : [];
    setImages(existingImgs);

    // Initialize custom fields
    setCustomFields(srv.customFields ? [...srv.customFields] : []);
    setIsAddModalOpen(true);
  };

  // Image handlers
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImages([...images, reader.result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Custom Form Builder handlers
  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) {
      showToast('ফিল্ডের নাম (Label) প্রদান করুন', 'warning');
      return;
    }

    const fieldId = 'field_' + Date.now();
    const parsedOptions = newFieldType === 'select' && newFieldOptions.trim()
      ? newFieldOptions.split(',').map(o => o.trim()).filter(Boolean)
      : undefined;

    const newField: FormField = {
      id: fieldId,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
      placeholder: newFieldPlaceholder.trim() || undefined,
      options: parsedOptions,
    };

    setCustomFields([...customFields, newField]);
    setNewFieldLabel('');
    setNewFieldPlaceholder('');
    setNewFieldOptions('');
    setNewFieldRequired(true);
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || price <= 0) {
      showToast('সবগুলো প্রয়োজনীয় ফিল্ড সঠিকভাবে পূরণ করুন!', 'error');
      return;
    }

    const featuresArray = featuresStr
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const primaryImage = images.length > 0 ? images[0] : undefined;

    const serviceData = {
      name: name.trim(),
      nameBn: nameBn.trim() || undefined,
      category: category.trim(),
      description: description.trim(),
      features: featuresArray,
      price: Number(price),
      originalPrice: Number(originalPrice) || undefined,
      duration: duration.trim(),
      badge: badge.trim() || undefined,
      isActive,
      isPopular,
      isRecommended,
      image: primaryImage,
      images: images.length > 0 ? images : undefined,
      customFields: customFields.length > 0 ? customFields : undefined,
    };

    if (editingService) {
      updateService(editingService.id, serviceData);
    } else {
      addService({
        ...serviceData,
        icon: 'Briefcase',
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleQuickPriceSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceEditService) return;
    updateService(priceEditService.id, { price: quickPrice });
    setPriceEditService(null);
  };

  const filtered = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nameBn && s.nameBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategoryFilter === 'all' ||
      s.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            প্রোডাক্ট ও সার্ভিস ম্যানেজমেন্ট
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            মাল্টিপল ছবি, কাস্টম ফর্ম রিকয়ারমেন্ট, জনপ্রিয় ও রিকমেন্ডেড প্যাকেজ ফ্ল্যাগ কনফিগার করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সার্ভিস যোগ করুন</span>
        </button>
      </div>

      {/* Filter, Search & Category Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="সার্ভিস বা প্যাকেজের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Dynamic Category Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 shrink-0">ক্যাটাগরি:</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <option value="all">সকল ক্যাটাগরি ({services.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} {c.nameBn ? `(${c.nameBn})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">
            কোন সার্ভিস পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-850 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3.5 px-4">সার্ভিস ও ছবি</th>
                  <th className="py-3.5 px-4">ক্যাটাগরি</th>
                  <th className="py-3.5 px-4">মূল্য (Price)</th>
                  <th className="py-3.5 px-4 text-center">হোম সেকশন ফ্ল্যাগ</th>
                  <th className="py-3.5 px-4 text-center">কাস্টম ফর্ম</th>
                  <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {filtered.map((srv) => {
                  const imgCount = srv.images?.length || (srv.image ? 1 : 0);
                  const formFieldsCount = srv.customFields?.length || 0;

                  return (
                    <tr key={srv.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                      
                      {/* Name and Image Preview */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-700 shrink-0 overflow-hidden relative border border-gray-200 dark:border-gray-600">
                            {srv.image ? (
                              <img
                                src={srv.image}
                                alt={srv.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                SP
                              </div>
                            )}
                            {imgCount > 1 && (
                              <span className="absolute bottom-0 right-0 bg-black/70 text-[9px] text-white px-1 rounded-tl font-bold">
                                +{imgCount}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white line-clamp-1">
                              {srv.name}
                            </div>
                            {srv.nameBn && (
                              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                {srv.nameBn}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium text-[11px]">
                          {srv.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            ৳{srv.price.toLocaleString()}
                          </span>
                          {srv.originalPrice && srv.originalPrice > srv.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ৳{srv.originalPrice}
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setPriceEditService(srv);
                              setQuickPrice(srv.price);
                            }}
                            className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                            title="দ্রুত মূল্য পরিবর্তন"
                          >
                            <DollarSign className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Requirement 1: Popular & Recommended quick toggles */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Popular Toggle */}
                          <button
                            onClick={() => updateService(srv.id, { isPopular: !srv.isPopular })}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                              srv.isPopular
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ring-1 ring-amber-400'
                                : 'bg-gray-100 text-gray-400 dark:bg-gray-750 dark:text-gray-500 hover:bg-gray-200'
                            }`}
                            title={srv.isPopular ? 'Popular Package থেকে সরান' : 'Popular Package হিসেবে হোমপেজে দেখান'}
                          >
                            <Star className={`w-3 h-3 ${srv.isPopular ? 'fill-amber-400 text-amber-500' : ''}`} />
                            <span>Popular</span>
                          </button>

                          {/* Recommended Toggle */}
                          <button
                            onClick={() => updateService(srv.id, { isRecommended: !srv.isRecommended })}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                              srv.isRecommended
                                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 ring-1 ring-indigo-400'
                                : 'bg-gray-100 text-gray-400 dark:bg-gray-750 dark:text-gray-500 hover:bg-gray-200'
                            }`}
                            title={srv.isRecommended ? 'Recommended Package থেকে সরান' : 'Recommended Package হিসেবে হোমপেজে দেখান'}
                          >
                            <Sparkles className={`w-3 h-3 ${srv.isRecommended ? 'text-indigo-500' : ''}`} />
                            <span>Recommended</span>
                          </button>
                        </div>
                      </td>

                      {/* Requirement 3: Custom Form Fields Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {formFieldsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                            <CheckSquare className="w-3 h-3 text-purple-600" />
                            <span>{formFieldsCount} টি ফিল্ড</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">ফর্ম নেই</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => updateService(srv.id, { isActive: !srv.isActive })}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            srv.isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          }`}
                        >
                          {srv.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(srv)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setServiceToDelete(srv)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal with Multiple Images & Custom Form Builder */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div 
            className="w-full max-w-3xl my-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-600" />
                <span>{editingService ? 'সার্ভিস ও প্যাকেজ সম্পাদনা' : 'নতুন সার্ভিস ও প্যাকেজ যোগ করুন'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg text-xs font-bold"
              >
                ✕ বন্ধ
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-5">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    সার্ভিসের ইংরেজি নাম (Title) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Facebook Page Growth Boost"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    বাংলা নাম (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ফেসবুক পেজ গ্রোথ সার্ভিস"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Dynamic Category & Delivery Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    ক্যাটাগরি নির্বাচন করুন
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} {c.nameBn ? `(${c.nameBn})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    ডেলিভারি সময় (Duration)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ৩-৫ দিন / ১২ ঘণ্টা"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Price, Original Price, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    বিক্রয় মূল্য (Price ৳) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    পূর্বমূল্য (Original ৳)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    ব্যাজ ট্যাগ (Badge)
                  </label>
                  <input
                    type="text"
                    placeholder="হট ডিল / জনপ্রিয়"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Requirement 1: Home Page Section Placement Toggles */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-3">
                <div className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>হোম পেজ ডিসপ্লে সেটিংস (Home Page Sections)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Popular Package toggle */}
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-amber-200/80 dark:border-amber-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">
                        Popular Package হিসেবে প্রদর্শন
                      </div>
                      <div className="text-[10px] text-gray-500">
                        হোম পেজের "Popular Package" সেকশনে যুক্ত হবে
                      </div>
                    </div>
                  </label>

                  {/* Recommended Package toggle */}
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-amber-200/80 dark:border-amber-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRecommended}
                      onChange={(e) => setIsRecommended(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-white">
                        Recommended Package হিসেবে প্রদর্শন
                      </div>
                      <div className="text-[10px] text-gray-500">
                        হোম পেজের "Recommended Package" সেকশনে যুক্ত হবে
                      </div>
                    </div>
                  </label>

                </div>
              </div>

              {/* Requirement 2: Multiple Images Management */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>সার্ভিসের ছবি ম্যানেজমেন্ট (Single or Multiple Images)</span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {images.length} টি ছবি যুক্ত আছে
                  </span>
                </div>

                {/* Add Image input & upload button */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="url"
                    placeholder="ছবির অনলাইন ইউআরএল (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="w-full sm:w-auto px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                  >
                    লিঙ্ক যোগ করুন
                  </button>
                  <label className="w-full sm:w-auto px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>ফাইল আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileUpload}
                    />
                  </label>
                </div>

                {/* Image gallery thumbnails */}
                {images.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto py-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-rose-500/50 group"
                      >
                        <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-0 left-0 bg-rose-600 text-[8px] text-white font-bold px-1 rounded-br">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-0.5 bg-black/70 hover:bg-rose-600 text-white rounded transition-colors"
                          title="ছবি বাদ দিন"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Requirement 3: Custom Form Builder System */}
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-purple-950 dark:text-purple-300 flex items-center gap-1.5">
                      <ListPlus className="w-4 h-4 text-purple-600" />
                      <span>কাস্টম রিকয়ারমেন্ট ফর্ম বিল্ডার (Order Form Builder)</span>
                    </div>
                    <p className="text-[10px] text-purple-700 dark:text-purple-400 mt-0.5">
                      অর্ডার প্রসেসিংয়ের সময় গ্রাহকের কাছ থেকে যে তথ্যগুলো সংগ্রহ করা প্রয়োজন তা এখানে যোগ করুন।
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full">
                    {customFields.length} টি ফিল্ড
                  </span>
                </div>

                {/* Existing Defined Fields */}
                {customFields.length > 0 && (
                  <div className="space-y-2">
                    {customFields.map((f, idx) => (
                      <div
                        key={f.id}
                        className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-purple-200 dark:border-purple-900/60 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-gray-900 dark:text-white">{f.label}</span>
                            <span className="text-[10px] text-gray-400 ml-2 font-mono">
                              [{f.type}] {f.required ? '(আবশ্যক)' : '(ঐচ্ছিক)'}
                            </span>
                            {f.options && (
                              <div className="text-[10px] text-purple-600 dark:text-purple-400">
                                Options: {f.options.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCustomField(f.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                          title="ফিল্ড মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Form Field Sub-Form */}
                <div className="pt-2 border-t border-purple-200/80 dark:border-purple-900/60 space-y-2.5">
                  <span className="text-[11px] font-bold text-purple-900 dark:text-purple-300">
                    + নতুন রিকয়ারমেন্ট ফিল্ড যোগ করুন:
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      placeholder="ফিল্ডের নাম (যেমন: Player ID / Page Link)"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs"
                    />

                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as any)}
                      className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs"
                    >
                      <option value="text">Single Text (সংক্ষিপ্ত টেক্সট)</option>
                      <option value="textarea">Textarea (দীর্ঘ বিবরণ)</option>
                      <option value="number">Number (সংখ্যা)</option>
                      <option value="url">URL (ওয়েবসাইট লিঙ্ক)</option>
                      <option value="file">File Upload (ছবি বা ফাইল)</option>
                      <option value="select">Dropdown Select (ড্রপডাউন)</option>
                    </select>

                    <input
                      type="text"
                      placeholder="প্লেসহোল্ডার টেক্সট (ঐচ্ছিক)"
                      value={newFieldPlaceholder}
                      onChange={(e) => setNewFieldPlaceholder(e.target.value)}
                      className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs"
                    />
                  </div>

                  {newFieldType === 'select' && (
                    <input
                      type="text"
                      placeholder="ড্রপডাউনের অপশনগুলো কমা দিয়ে লিখুন (যেমন: অপশন ১, অপশন ২, অপশন ৩)"
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                        className="w-3.5 h-3.5 text-purple-600 rounded"
                      />
                      <span>কাস্টমারের জন্য পূরণ করা বাধ্যতামূলক (Required)</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleAddCustomField}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold"
                    >
                      ফিল্ড যোগ করুন
                    </button>
                  </div>
                </div>
              </div>

              {/* Description & Features */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    সার্ভিসের পূর্ণ বিবরণ (Description) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="সার্ভিস সম্পর্কে বিস্তারিত লিখুন..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    প্যাকেজ ফিচারসমূহ (প্রতি লাইনে একটি করে ফিচার)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="টার্গেটেড অডিয়েন্স সেটআপ&#10;৩টি ব্যানার ডিজাইন&#10;২৪/৭ ভিআইপি সাপোর্ট"
                    value={featuresStr}
                    onChange={(e) => setFeaturesStr(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="srv-active-status"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="srv-active-status" className="text-xs text-gray-700 dark:text-gray-300 font-medium cursor-pointer">
                  সার্ভিসটি ওয়েবসাইটে প্রদর্শন (Active) রাখুন
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-xl shadow-md shadow-rose-600/20"
                >
                  {editingService ? 'পরিবর্তন সংরক্ষণ করুন' : 'সার্ভিস যোগ করুন'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Quick Price Change Modal */}
      {priceEditService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
              মূল্য পরিবর্তন: {priceEditService.name}
            </h3>
            <form onSubmit={handleQuickPriceSave} className="space-y-3">
              <div>
                <label className="text-[11px] text-gray-500">নতুন মূল্য (৳)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={quickPrice}
                  onChange={(e) => setQuickPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-bold text-rose-600"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPriceEditService(null)}
                  className="px-3 py-1.5 text-xs text-gray-500 border border-gray-300 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 rounded-lg"
                >
                  সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <ConfirmDeleteModal
          isOpen={!!serviceToDelete}
          title="সার্ভিস ডিলিট নিশ্চিতকরণ"
          message={`আপনি কি নিশ্চিতভাবে "${serviceToDelete.name}" সার্ভিসটি মুছে ফেলতে চান?`}
          onConfirm={() => {
            deleteService(serviceToDelete.id);
            setServiceToDelete(null);
          }}
          onClose={() => setServiceToDelete(null)}
          onCancel={() => setServiceToDelete(null)}
        />
      )}

    </div>
  );
};
