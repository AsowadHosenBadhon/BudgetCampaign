import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Check, X, Phone, 
  HelpCircle, CreditCard, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const AdminPayments: React.FC = () => {
  const { 
    paymentMethods, 
    addPaymentMethod, 
    updatePaymentMethod, 
    deletePaymentMethod, 
    showToast 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(null);

  // Form states
  const [name, setName] = useState('bKash (বিকাশ)');
  const [type, setType] = useState<'Personal' | 'Merchant' | 'Agent'>('Personal');
  const [number, setNumber] = useState('');
  const [instructions, setInstructions] = useState('');
  const [color, setColor] = useState('#D12053');
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName('bKash (বিকাশ)');
    setType('Personal');
    setNumber('');
    setInstructions('');
    setColor('#D12053');
    setIsActive(true);
    setEditingMethod(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (m: PaymentMethod) => {
    setEditingMethod(m);
    setName(m.name);
    setType(m.type);
    setNumber(m.number);
    setInstructions(m.instructions);
    setColor(m.color);
    setIsActive(m.isActive);
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !number.trim() || !instructions.trim()) {
      showToast('সবগুলো ফিল্ড সঠিকভাবে পূরণ করুন!', 'error');
      return;
    }

    if (editingMethod) {
      updatePaymentMethod(editingMethod.id, {
        name: name.trim(),
        type,
        number: number.trim(),
        instructions: instructions.trim(),
        color,
        isActive,
      });
    } else {
      addPaymentMethod({
        name: name.trim(),
        type,
        number: number.trim(),
        logo: name.toLowerCase().includes('bkash') ? 'bkash' : name.toLowerCase().includes('nagad') ? 'nagad' : 'rocket',
        instructions: instructions.trim(),
        color,
        isActive,
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            Payment Method Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            বিকাশ, নগদ, রকেট সহ পেমেন্ট অ্যাকাউন্ট নাম্বার পরিবর্তন ও নতুন মেথড যোগ করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পেমেন্ট মেথড যোগ করুন</span>
        </button>
      </div>

      {/* Payment Method Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`rounded-2xl border bg-white dark:bg-gray-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-all ${
              method.isActive
                ? 'border-gray-200 dark:border-gray-700/80 hover:shadow-md'
                : 'border-gray-200 dark:border-gray-800 opacity-60 bg-gray-50 dark:bg-gray-850'
            }`}
          >
            <div>
              {/* Method Title, Type & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700/60">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: method.color || '#e11d48' }}
                  />
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                      {method.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-gray-400">
                      ({method.type} Account)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => updatePaymentMethod(method.id, { isActive: !method.isActive })}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    method.isActive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {method.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Payment Number Card */}
              <div className="my-4 p-3.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  পেমেন্ট গ্রহণ নাম্বার:
                </div>
                <div className="text-lg font-mono font-extrabold text-gray-900 dark:text-white mt-0.5 tracking-wider">
                  {method.number}
                </div>
              </div>

              {/* Instructions preview */}
              <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                <span className="font-semibold text-gray-800 dark:text-gray-200">নির্দেশনা: </span>
                {method.instructions}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenEdit(method)}
                className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>নাম্বার বা তথ্য পরিবর্তন</span>
              </button>
              
              <button
                id={`delete-payment-btn-${method.id}`}
                onClick={() => setMethodToDelete(method)}
                className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                title="মেথড মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {editingMethod ? 'পেমেন্ট মেথড এডিট করুন' : 'নতুন পেমেন্ট মেথড যুক্ত করুন'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  মেথডের নাম (Method Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: bKash (বিকাশ) বা Nagad (নগদ)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    অ্যাকাউন্ট টাইপ (Account Type)
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Merchant">Merchant</option>
                    <option value="Agent">Agent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ব্র্যান্ড কালার (Hex Color)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full px-2 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  পেমেন্ট রিসিভ নাম্বার (Payment Number) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="01XXXXXXXXX"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  কাস্টমার পেমেন্ট নির্দেশনা (Instructions) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="কীভাবে টাকা পাঠাবে, ডায়াল কোড এবং ট্রানজেকশন আইডি সংরক্ষণের নিয়ম..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pm-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="pm-active" className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  এই পেমেন্ট মেথডটি সক্রিয় (Active) রাখুন
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!methodToDelete}
        onClose={() => setMethodToDelete(null)}
        onConfirm={() => {
          if (methodToDelete) {
            deletePaymentMethod(methodToDelete.id);
            setMethodToDelete(null);
          }
        }}
        title="পেমেন্ট মেথড মুছে ফেলুন"
        itemName={methodToDelete ? `${methodToDelete.name} (${methodToDelete.number})` : undefined}
        description={`আপনি কি নিশ্চিতভাবে "${methodToDelete?.name || ''}" পেমেন্ট মেথডটি ডিলিট করতে চান? গ্রাহকরা আর এই মেথডে টাকা পাঠাতে পারবেন না।`}
        confirmText="হ্যাঁ, মেথড মুছুন"
        cancelText="বাতিল"
        idPrefix="payment-delete"
      />

    </div>
  );
};
