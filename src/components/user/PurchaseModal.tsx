import React, { useState } from 'react';
import { 
  X, Copy, Check, Upload, ArrowRight, ShieldCheck, 
  HelpCircle, AlertCircle, Image as ImageIcon 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';

export const PurchaseModal: React.FC = () => {
  const { 
    selectedServiceForPurchase, 
    setSelectedServiceForPurchase, 
    paymentMethods,
    createOrder,
    currentUser,
    setIsPurchaseAuthPromptOpen,
    setPromptServiceForPurchase,
    setIsAuthModalOpen,
    setActiveTab,
    showToast
  } = useApp();

  const activeMethods = paymentMethods.filter(pm => pm.isActive);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(activeMethods[0]?.id || '');
  const [copied, setCopied] = useState<boolean>(false);

  // Form Fields
  const [senderNumber, setSenderNumber] = useState<string>(currentUser?.phone || '');
  const [transactionId, setTransactionId] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<number>(selectedServiceForPurchase?.price || 0);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Auto-redirect to auth prompt modal if unauthenticated
  React.useEffect(() => {
    if (!currentUser && selectedServiceForPurchase) {
      setPromptServiceForPurchase(selectedServiceForPurchase);
      setSelectedServiceForPurchase(null);
      setIsPurchaseAuthPromptOpen(true);
    }
  }, [currentUser, selectedServiceForPurchase, setPromptServiceForPurchase, setSelectedServiceForPurchase, setIsPurchaseAuthPromptOpen]);

  // Update paid amount if service changes
  React.useEffect(() => {
    if (selectedServiceForPurchase) {
      setPaidAmount(selectedServiceForPurchase.price);
      if (currentUser?.phone && !senderNumber) {
        setSenderNumber(currentUser.phone);
      }
    }
  }, [selectedServiceForPurchase, currentUser]);

  if (!selectedServiceForPurchase) return null;

  const currentMethod: PaymentMethod | undefined = activeMethods.find(m => m.id === selectedMethodId) || activeMethods[0];

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num.replace(/[^0-9]/g, ''));
    setCopied(true);
    showToast('নাম্বার কপি করা হয়েছে!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('ফাইল সাইজ ৫MB এর বেশি হতে পারবে না', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!senderNumber || senderNumber.trim().length < 11) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১১ ডিজিটের প্রেরক মোবাইল নাম্বার দিন।');
      return;
    }

    if (!transactionId || transactionId.trim().length < 6) {
      setErrorMsg('অনুগ্রহ করে সঠিক Transaction ID (TrxID) প্রদান করুন।');
      return;
    }

    if (!paidAmount || paidAmount <= 0) {
      setErrorMsg('সঠিক পেমেন্ট এমাউন্ট প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);

    const result = createOrder({
      serviceId: selectedServiceForPurchase.id,
      serviceName: selectedServiceForPurchase.nameBn || selectedServiceForPurchase.name,
      servicePrice: selectedServiceForPurchase.price,
      paidAmount: Number(paidAmount),
      paymentMethod: currentMethod ? currentMethod.name : 'Manual',
      senderNumber: senderNumber.trim(),
      transactionId: transactionId.trim().toUpperCase(),
      screenshotUrl: screenshotUrl || undefined,
      notes: notes.trim(),
    });

    setIsSubmitting(false);

    if (result.success) {
      setSelectedServiceForPurchase(null);
      // Reset form
      setTransactionId('');
      setScreenshotUrl('');
      setNotes('');
      // Navigate to orders tab so user sees their pending order
      setActiveTab('orders');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl my-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-rose-50 to-indigo-50 dark:from-gray-800/60 dark:to-gray-800/30">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              সার্ভিস পারচেজ ও পেমেন্ট
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-1">
              {selectedServiceForPurchase.nameBn || selectedServiceForPurchase.name}
            </h3>
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 flex items-center gap-2">
              <span>মূল্য: <strong className="text-rose-600 dark:text-rose-400 text-sm">৳{selectedServiceForPurchase.price.toLocaleString()}</strong></span>
              <span>•</span>
              <span>ডেলিভারি: {selectedServiceForPurchase.duration}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedServiceForPurchase(null)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Step 1: Select Payment Method & View Number */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-2">
              ১. পেমেন্ট মেথড নির্বাচন করুন (Select Method)
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {activeMethods.map((method) => {
                const isSelected = method.id === (currentMethod?.id || selectedMethodId);
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethodId(method.id);
                      setCopied(false);
                    }}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/20 font-bold'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: method.color || '#e11d48' }}
                    />
                    <span className="text-xs sm:text-sm font-semibold">{method.name}</span>
                    <span className="text-[10px] text-gray-400">({method.type})</span>
                  </button>
                );
              })}
            </div>

            {/* Payment Number & Instructions Card */}
            {currentMethod && (
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      {currentMethod.name} পেমেন্ট নাম্বার ({currentMethod.type}):
                    </div>
                    <div className="text-lg sm:text-xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
                      {currentMethod.number}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyNumber(currentMethod.number)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-100 shadow-sm transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-gray-500" />
                        <span>নাম্বার কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Instructions text */}
                <div className="mt-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{currentMethod.instructions}</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Payment Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
                ২. পেমেন্ট সাবমিশন ফর্ম (Payment Details Form)
              </label>
              <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ভেরিফাইড সিকিউর
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Sender Phone Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  যে নাম্বার থেকে পেমেন্ট করেছেন *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: BK9A87ZX2 বা 9J4K2L8"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono uppercase"
                />
              </div>
            </div>

            {/* Paid Amount */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                কত টাকা পেমেন্ট করেছেন (Paid Amount in ৳) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 font-bold">৳</span>
                <input
                  type="number"
                  required
                  min={100}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                />
              </div>
            </div>

            {/* Payment Screenshot Upload */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                পেমেন্ট স্ক্রিনশট আপলোড (Payment Screenshot)
              </label>
              <div className="mt-1 flex flex-col sm:flex-row items-center gap-3">
                <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-rose-500 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                    {screenshotUrl ? 'অন্য স্ক্রিনশট বেছে নিন' : 'স্ক্রিনশট ফাইল নির্বাচন করুন (Max 5MB)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                
                {/* Or paste sample screenshot */}
                {!screenshotUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshotUrl('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
                      showToast('ডেমো রিসিট স্ক্রিনশট যুক্ত হয়েছে', 'info');
                    }}
                    className="text-[11px] text-rose-600 hover:underline shrink-0"
                  >
                    + ডেমো স্ক্রিনশট দিন
                  </button>
                )}
              </div>

              {/* Screenshot Preview */}
              {screenshotUrl && (
                <div className="mt-2 relative inline-block rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
                  <img 
                    src={screenshotUrl} 
                    alt="Payment receipt proof" 
                    className="h-20 w-32 object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => setScreenshotUrl('')}
                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-rose-600 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Additional Note (Optional) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                অতিরিক্ত নোট (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="যেমন: আপনার ফেসবুক পেজের লিংক, কাজের স্পেসিফিক রিকোয়ারমেন্টস বা হোয়াটসঅ্যাপ নাম্বার..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>অর্ডার সাবমিট করুন (Submit Order)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-gray-400 mt-2">
                * সাবমিট করার পর অর্ডারটি স্বয়ংক্রিয়ভাবে <strong>Pending</strong> অবস্থায় থাকবে এবং অ্যাডমিন ভেরিফাই করবে।
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
