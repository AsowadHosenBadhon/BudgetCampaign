import React, { useState } from 'react';
import { 
  FileText, Upload, CheckCircle2, AlertCircle, 
  X, ShieldCheck, ArrowRight, Image as ImageIcon 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, CustomFormField } from '../../types';

interface OrderFormModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({ order, onClose }) => {
  const { services, submitOrderForm } = useApp();

  // Find corresponding service
  const service = services.find(
    s => s.id === order.serviceId || s.name === order.serviceName || s.nameBn === order.serviceName
  );

  // Use service's custom fields, or default intake fields if none configured
  const fields: CustomFormField[] = (service?.customFields && service.customFields.length > 0)
    ? service.customFields
    : [
        {
          id: 'target_url',
          label: 'Target URL / Link (পেজ বা প্রোফাইল লিংক)',
          labelBn: 'টার্গেট লিংক বা পেজের লিংক',
          type: 'text',
          placeholder: 'https://...',
          required: true,
          description: 'যে পেজ, গ্রুপ বা প্রোফাইলে সার্ভিস প্রদান করতে হবে তার লিংক দিন'
        },
        {
          id: 'user_notes',
          label: 'Special Instructions / Requirements',
          labelBn: 'বিশেষ দিকনির্দেশনা ও বিস্তারিত তথ্য',
          type: 'textarea',
          placeholder: 'সার্ভিস শুরু করার জন্য আপনার কোনো বিশেষ চাহিদা বা নির্দেশনা থাকলে লিখুন...',
          required: false
        },
        {
          id: 'attachment_file',
          label: 'Attachment / Document Screenshot (ঐচ্ছিক ফাইল)',
          labelBn: 'প্রয়োজনীয় ডকুমেন্ট বা স্ক্রিনশট',
          type: 'file',
          required: false,
          description: 'প্রয়োজনে ইমেজ বা ফাইল আপলোড করুন'
        }
      ];

  // Form field values state
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    // If order already had partial submission, load it
    return order.formSubmission?.values || {};
  });

  const [filePreviews, setFilePreviews] = useState<Record<string, { name: string; url: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFileUpload = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('ফাইলের সাইজ ৫ মেগাবাইট (5MB)-এর কম হতে হবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFilePreviews(prev => ({
        ...prev,
        [fieldId]: { name: file.name, url: result }
      }));
      handleInputChange(fieldId, result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validate required fields
    for (const field of fields) {
      if (field.required) {
        const val = formValues[field.id];
        if (val === undefined || val === null || val === '') {
          setErrorMsg(`"${field.labelBn || field.label}" ফিল্ডটি পূরণ করা আবশ্যক।`);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      submitOrderForm(order.id, formValues);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setErrorMsg('ফর্ম সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-rose-50 to-indigo-50 dark:from-gray-850 dark:to-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                  অর্ডার প্রসেসিং ফর্ম
                </span>
                <span className="text-xs font-mono text-gray-500">#{order.id}</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
                Complete Required Form
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Info Banner */}
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <p>
            <strong>{order.serviceName}</strong> সার্ভিসটি শুরু করার জন্য নিচের প্রয়োজনীয় তথ্যগুলো প্রদান করুন। সাবমিট করার সাথে সাথেই আপনার অর্ডারের স্ট্যাটাস <strong>"Running"</strong> এ রূপান্তরিত হবে।
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {fields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                {field.labelBn || field.label}
                {field.required && <span className="text-rose-500 ml-1">*</span>}
              </label>

              {field.description && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {field.description}
                </p>
              )}

              {/* Text Input */}
              {field.type === 'text' && (
                <input
                  type="text"
                  required={field.required}
                  value={formValues[field.id] || ''}
                  placeholder={field.placeholder || 'তথ্য লিখুন...'}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              )}

              {/* Number Input */}
              {field.type === 'number' && (
                <input
                  type="number"
                  required={field.required}
                  value={formValues[field.id] || ''}
                  placeholder={field.placeholder || 'সংখ্যা লিখুন...'}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              )}

              {/* Textarea */}
              {field.type === 'textarea' && (
                <textarea
                  rows={3}
                  required={field.required}
                  value={formValues[field.id] || ''}
                  placeholder={field.placeholder || 'বিস্তারিত বিবরণ লিখুন...'}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              )}

              {/* Select Dropdown */}
              {field.type === 'select' && (
                <select
                  required={field.required}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">নির্বাচন করুন (Select an option)</option>
                  {field.options?.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {/* File Upload */}
              {field.type === 'file' && (
                <div className="space-y-2">
                  <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-rose-500 bg-gray-50/50 dark:bg-gray-800/50 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      ফাইল বা ছবি আপলোড করুন
                    </span>
                    <span className="text-[10px] text-gray-400">
                      PNG, JPG, PDF (সর্বোচ্চ 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(field.id, e)}
                    />
                  </label>

                  {/* File preview if present */}
                  {(filePreviews[field.id] || formValues[field.id]) && (
                    <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <ImageIcon className="w-5 h-5 text-rose-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                          {filePreviews[field.id]?.name || 'আপলোডকৃত ফাইল'}
                        </p>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ সফলভাবে সংযুক্ত হয়েছে
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFilePreviews(prev => {
                            const copy = { ...prev };
                            delete copy[field.id];
                            return copy;
                          });
                          handleInputChange(field.id, null);
                        }}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2 py-1"
                      >
                        মুছুন
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'জমা দেওয়া হচ্ছে...' : 'তথ্য সাবমিট করুন (Submit)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
