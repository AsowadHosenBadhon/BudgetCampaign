import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  dangerBadge?: string;
  idPrefix?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'মুছে ফেলার নিশ্চিতকরণ',
  itemName,
  description = 'আপনি কি নিশ্চিত যে আপনি এটি মুছে ফেলতে চান? এই প্রক্রিয়াটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।',
  confirmText = 'হ্যাঁ, মুছে ফেলুন',
  cancelText = 'বাতিল',
  dangerBadge = 'স্থায়ী পরিবর্তন',
  idPrefix = 'delete-confirm',
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id={`${idPrefix}-modal-backdrop`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            id={`${idPrefix}-modal-card`}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Header / Banner */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 shadow-xs">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        id={`${idPrefix}-title`}
                        className="text-lg font-bold text-gray-900 dark:text-white"
                      >
                        {title}
                      </h3>
                      {dangerBadge && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300">
                          {dangerBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      সতর্কতা: মুছে ফেলা ডেটা পুনরুদ্ধার করা সম্ভব নয়
                    </p>
                  </div>
                </div>

                <button
                  id={`${idPrefix}-close-btn`}
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Item Name highlight if provided */}
              {itemName && (
                <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-700/60 flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
                    {itemName}
                  </span>
                </div>
              )}

              {/* Description */}
              <p
                id={`${idPrefix}-desc`}
                className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {description}
              </p>
            </div>

            {/* Actions */}
            <div className="p-4 px-6 bg-gray-50/80 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-end gap-2.5">
              <button
                id={`${idPrefix}-cancel-btn`}
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors shadow-xs"
              >
                {cancelText}
              </button>

              <button
                id={`${idPrefix}-confirm-btn`}
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-colors flex items-center gap-1.5 shadow-sm shadow-rose-600/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
