import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, FolderPlus, Tag, 
  Layers, Search, CheckCircle2, XCircle, AlertCircle, 
  Sparkles, Check, ArrowUpDown 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, services } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setNameBn('');
    setSlug('');
    setDescription('');
    setIsActive(true);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameBn(cat.nameBn || '');
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIsActive(cat.isActive !== false);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('ক্যাটাগরির নাম আবশ্যক।');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        nameBn: nameBn.trim() || undefined,
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim() || undefined,
        isActive,
      });
    } else {
      addCategory({
        name: name.trim(),
        nameBn: nameBn.trim() || undefined,
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim() || undefined,
        isActive,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setDeleteConfirmId(null);
  };

  // Filter categories by search
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.nameBn && c.nameBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              ক্যাটাগরি ম্যানেজমেন্ট
            </h1>
            <span className="text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 px-2.5 py-0.5 rounded-full">
              {categories.length} টি ক্যাটাগরি
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            সার্ভিস ও প্যাকেজ সুন্দরভাবে সংগঠিত করতে নতুন ক্যাটাগরি তৈরি, পরিবর্তন ও মুছে ফেলুন।
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-rose-600/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি যুক্ত করুন</span>
        </button>
      </div>

      {/* Search and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="ক্যাটাগরি খুঁজুন (নাম বা স্ল্যাগ)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          মোট সার্ভিস অন্তর্ভুক্ত: <strong className="text-rose-600 dark:text-rose-400 font-bold">{services.length}</strong>
        </div>
      </div>

      {/* Category Table / Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
              কোন ক্যাটাগরি পাওয়া যায়নি
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              "নতুন ক্যাটাগরি যুক্ত করুন" বাটনে ক্লিক করে প্রথম ক্যাটাগরি তৈরি করুন।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-850 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="py-3.5 px-4 sm:px-6">ক্যাটাগরির নাম (Title)</th>
                  <th className="py-3.5 px-4">স্ল্যাগ (Slug)</th>
                  <th className="py-3.5 px-4">সংযুক্ত সার্ভিস</th>
                  <th className="py-3.5 px-4">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-xs sm:text-sm">
                {filteredCategories.map((cat) => {
                  const serviceCount = services.filter(
                    s => s.categoryId === cat.id || s.category.toLowerCase() === cat.name.toLowerCase()
                  ).length;

                  return (
                    <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                      {/* Name */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Tag className="w-4 h-4 text-rose-500 shrink-0" />
                          <span>{cat.name}</span>
                          {cat.nameBn && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                              ({cat.nameBn})
                            </span>
                          )}
                        </div>
                        {cat.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 max-w-xs sm:max-w-md">
                            {cat.description}
                          </p>
                        )}
                      </td>

                      {/* Slug */}
                      <td className="py-4 px-4 font-mono text-xs text-gray-600 dark:text-gray-300">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                          /{cat.slug}
                        </span>
                      </td>

                      {/* Services count */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700/60 text-gray-800 dark:text-gray-200">
                          <Layers className="w-3 h-3 text-indigo-500" />
                          <span>{serviceCount} টি সার্ভিস</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {cat.isActive !== false ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>সক্রিয়</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" />
                            <span>নিষ্ক্রিয়</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                            title="এডিট করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(cat.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-rose-600" />
                <span>{editingCategory ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    ক্যাটাগরির নাম (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Social Media Ads"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    বাংলা নাম (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সোশ্যাল মিডিয়া এডস"
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  ইউআরএল স্ল্যাগ (Slug)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-700 rounded-l-xl text-xs text-gray-500">
                    /category/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-r-xl text-xs sm:text-sm text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  সংক্ষিপ্ত বিবরণ (Description)
                </label>
                <textarea
                  rows={2}
                  placeholder="এই ক্যাটাগরিতে কী ধরনের সার্ভিস অন্তর্ভুক্ত..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat-is-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                />
                <label htmlFor="cat-is-active" className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                  ক্যাটাগরি সক্রিয় রাখুন (User Panel-এ দৃশ্যমান থাকবে)
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/25 cursor-pointer"
                >
                  {editingCategory ? 'পরিবর্তন সংরক্ষণ করুন' : 'ক্যাটাগরি যুক্ত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              ক্যাটাগরি মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              এই ক্যাটাগরি মুছে ফেললে এটি ইউজার প্যানেলের ফিল্টার থেকে বাদ যাবে। আপনি কি নিশ্চিত?
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                না, রাখুন
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
