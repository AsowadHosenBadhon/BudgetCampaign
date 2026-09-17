import React, { useState } from 'react';
import { 
  Search, Filter, CheckCircle2, XCircle, Clock, 
  Eye, MessageSquare, Trash2, Check, X, AlertCircle, Phone, Mail,
  PlayCircle, CheckCircle, FileCheck2, FileText, ChevronRight,
  RotateCcw, Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, requestPaymentProof, deleteOrder, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedScreenshotOrder, setSelectedScreenshotOrder] = useState<Order | null>(null);
  const [viewFormOrder, setViewFormOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Status Change Dialog
  const [statusDialogOrder, setStatusDialogOrder] = useState<Order | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus>('approved');
  const [statusNote, setStatusNote] = useState<string>('');

  // Payment Proof Request Dialog
  const [paymentProofDialogOrder, setPaymentProofDialogOrder] = useState<Order | null>(null);
  const [paymentProofReason, setPaymentProofReason] = useState<string>('');

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = selectedStatus === 'all' || ord.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      ord.id.toLowerCase().includes(q) ||
      ord.userName.toLowerCase().includes(q) ||
      ord.userPhone.includes(q) ||
      ord.serviceName.toLowerCase().includes(q) ||
      ord.transactionId.toLowerCase().includes(q) ||
      ord.senderNumber.includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusDefaultNote = (status: OrderStatus): string => {
    switch (status) {
      case 'approved':
        return 'পেমেন্ট ভেরিফাইড হয়েছে। আপনার অর্ডার অনুমোদিত হয়েছে।';
      case 'processing':
        return 'আপনার অর্ডারটি প্রসেসিংয়ে রয়েছে। অনুগ্রহ করে অর্ডার পেইজ থেকে সার্ভিস রিকয়ারমেন্ট ফর্মটি পূরণ করুন।';
      case 'running':
        return 'আপনার সাবমিট করা ফর্ম ডেটা যাচাই করে সার্ভিস প্রসেসিং ও ডেলিভারি কাজ বর্তমানে চলমান রয়েছে।';
      case 'completed':
        return 'আপনার সার্ভিস অর্ডার সফলভাবে সম্পন্ন হয়েছে। আমাদের প্ল্যাটফর্ম ব্যবহার করার জন্য ধন্যবাদ!';
      case 'rejected':
        return 'পেমেন্ট ট্রানজেকশন আইডি সঠিক নয় অথবা প্রদত্ত তথ্য অসম্পূর্ণ থাকায় অর্ডারটি বাতিল করা হয়েছে।';
      case 'pending':
      default:
        return 'পেমেন্ট ও অর্ডার যাচাইকরণ প্রক্রিয়াধীন।';
    }
  };

  const handleOpenStatusChange = (order: Order, newStatus: OrderStatus) => {
    setStatusDialogOrder(order);
    setTargetStatus(newStatus);
    setStatusNote(getStatusDefaultNote(newStatus));
  };

  const handleConfirmStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusDialogOrder) return;
    updateOrderStatus(statusDialogOrder.id, targetStatus, statusNote);
    setStatusDialogOrder(null);
  };

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300">
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300">
            <Clock className="w-3 h-3" />
            <span>Processing</span>
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300">
            <PlayCircle className="w-3 h-3" />
            <span>Running</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
            <CheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            অর্ডার ও ট্রানজেকশন ম্যানেজমেন্ট
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            গ্রাহকদের অর্ডার স্ট্যাটাস ৬টি ধাপে পরিবর্তন করুন এবং ইউজার কর্তৃক জমা দেওয়া কাস্টম ফরমের তথ্য যাচাই করুন।
          </p>
        </div>

        {/* Status Counts */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200">
            Pending: {orders.filter(o => o.status === 'pending').length}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-200">
            Processing: {orders.filter(o => o.status === 'processing').length}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 border border-cyan-200">
            Running: {orders.filter(o => o.status === 'running').length}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
            Completed: {orders.filter(o => o.status === 'completed').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="গ্রাহকের নাম, মোবাইল, TrxID বা সার্ভিস..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-xl scrollbar-none">
          {[
            { id: 'all', label: 'সকল অর্ডার' },
            { id: 'pending', label: 'Pending' },
            { id: 'approved', label: 'Approved' },
            { id: 'processing', label: 'Processing' },
            { id: 'running', label: 'Running' },
            { id: 'completed', label: 'Completed' },
            { id: 'rejected', label: 'Rejected' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedStatus(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === f.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">
            কোন অর্ডার খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-850 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">ইউজার (User Info)</th>
                  <th className="py-3.5 px-4">সার্ভিস (Service)</th>
                  <th className="py-3.5 px-4">পেমেন্ট ও TrxID</th>
                  <th className="py-3.5 px-4 text-center">ফর্ম সাবমিশন</th>
                  <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">স্ট্যাটাস পরিবর্তন (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                {filteredOrders.map((ord) => {
                  const hasFormSubmission = !!ord.formSubmission;

                  return (
                    <tr key={ord.id} className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
                      
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-gray-900 dark:text-white text-xs">
                          {ord.id}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {ord.createdAt}
                        </div>
                      </td>

                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {ord.userName}
                        </div>
                        <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" /> {ord.userPhone || 'নাম্বার নেই'}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {ord.userEmail}
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900 dark:text-white line-clamp-1 max-w-[180px]">
                          {ord.serviceName}
                        </div>
                        <div className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                          ৳{ord.paidAmount.toLocaleString()}
                        </div>
                      </td>

                      {/* Payment & TrxID */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded w-fit text-[11px]">
                          {ord.transactionId}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {ord.paymentMethod} • প্রেরক: {ord.senderNumber}
                        </div>

                        {ord.paymentProofRequested && (
                          <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                            <AlertCircle className="w-3 h-3 text-rose-500" />
                            <span>প্রুফ রিকোয়েস্ট পেন্ডিং</span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {ord.screenshotUrl && (
                            <button
                              onClick={() => setSelectedScreenshotOrder(ord)}
                              className="text-[11px] text-rose-600 hover:text-rose-700 underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>স্ক্রিনশট দেখুন</span>
                            </button>
                          )}

                          {/* Request Payment Proof Button if transaction ID was wrong */}
                          {(ord.status === 'pending' || ord.status === 'rejected') && (
                            <button
                              id={`request-proof-btn-${ord.id}`}
                              onClick={() => {
                                setPaymentProofDialogOrder(ord);
                                setPaymentProofReason(ord.paymentProofRequestNote || 'আপনার প্রদত্ত Transaction ID টি সঠিক নয়। অনুগ্রহ করে সঠিক TrxID ও পেমেন্ট প্রুফ পুনরায় সাবমিট করুন।');
                              }}
                              className="text-[11px] text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer border border-amber-200 dark:border-amber-800"
                              title="ইউজারকে পুনরায় সঠিক TrxID ও পেমেন্ট প্রুফ জমা দিতে বলুন"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>ভুল TrxID / প্রুফ রিকোয়েস্ট</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Requirement 3: User's Custom Form Submission Details */}
                      <td className="py-3.5 px-4 text-center">
                        {hasFormSubmission ? (
                          <button
                            onClick={() => setViewFormOrder(ord)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 hover:bg-purple-100 rounded-lg text-[11px] font-bold border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
                            title="ইউজার কর্তৃক সাবমিট করা তথ্য দেখুন"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>তথ্য দেখুন</span>
                          </button>
                        ) : ord.status === 'processing' ? (
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded">
                            অপেক্ষমান...
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {renderStatusBadge(ord.status)}
                      </td>

                      {/* Actions: 6-stage lifecycle transitions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 flex-wrap">
                          
                          {/* Approve (if pending) */}
                          {ord.status === 'pending' && (
                            <button
                              onClick={() => handleOpenStatusChange(ord, 'approved')}
                              className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 hover:bg-blue-100 font-bold text-[10px] flex items-center gap-0.5"
                              title="অনুমোদন করুন (Approve)"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Set Processing (User must fill form) */}
                          {(ord.status === 'pending' || ord.status === 'approved') && (
                            <button
                              onClick={() => handleOpenStatusChange(ord, 'processing')}
                              className="px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 hover:bg-purple-100 font-bold text-[10px] flex items-center gap-0.5"
                              title="প্রসেসিংয়ে পাঠান (User Form Required)"
                            >
                              <Clock className="w-3 h-3" />
                              <span>Processing</span>
                            </button>
                          )}

                          {/* Set Running */}
                          {(ord.status === 'processing' || ord.status === 'approved') && (
                            <button
                              onClick={() => handleOpenStatusChange(ord, 'running')}
                              className="px-2 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-700 hover:bg-cyan-100 font-bold text-[10px] flex items-center gap-0.5"
                              title="চলমান হিসেবে মার্ক করুন (Running)"
                            >
                              <PlayCircle className="w-3 h-3" />
                              <span>Running</span>
                            </button>
                          )}

                          {/* Mark Completed */}
                          {(ord.status === 'running' || ord.status === 'processing' || ord.status === 'approved') && (
                            <button
                              onClick={() => handleOpenStatusChange(ord, 'completed')}
                              className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] flex items-center gap-0.5"
                              title="সম্পন্ন করুন (Completed)"
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Complete</span>
                            </button>
                          )}

                          {/* Reject */}
                          {ord.status !== 'rejected' && ord.status !== 'completed' && (
                            <button
                              onClick={() => handleOpenStatusChange(ord, 'rejected')}
                              className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 hover:bg-rose-100 font-bold text-[10px] flex items-center gap-0.5"
                              title="বাতিল করুন (Reject)"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Delete Order */}
                          <button
                            onClick={() => setOrderToDelete(ord)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                            title="অর্ডার ডিলিট করুন"
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

      {/* Requirement 3: Admin Modal for Viewing User's Form Submission Details */}
      {viewFormOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl p-6 border border-gray-200 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-purple-600" />
                  <span>কাস্টমার কর্তৃক জমা দেওয়া ফর্ম ডেটা</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  অর্ডার: <strong className="font-mono text-gray-700 dark:text-gray-300">{viewFormOrder.id}</strong> • গ্রাহক: {viewFormOrder.userName}
                </p>
              </div>
              <button
                onClick={() => setViewFormOrder(null)}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕ বন্ধ করুন
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-xs text-purple-800 dark:text-purple-300 flex items-center justify-between">
                <span>সার্ভিস: <strong>{viewFormOrder.serviceName}</strong></span>
                <span>তারিখ: {viewFormOrder.formSubmission?.submittedAt || 'N/A'}</span>
              </div>

              {viewFormOrder.formSubmission ? (
                Object.entries(
                  viewFormOrder.formSubmission.values || 
                  viewFormOrder.formSubmission.data || 
                  {}
                ).map(([key, value]) => (
                  <div key={key} className="p-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      {key}
                    </div>
                    {typeof value === 'string' && value.startsWith('data:image') ? (
                      <div className="mt-2">
                        <img 
                          src={value} 
                          alt={key} 
                          className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-700 object-contain" 
                        />
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mt-1 break-all select-all">
                        {String(value || 'প্রদান করা হয়নি')}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-gray-400">
                  কোন ফর্ম তথ্য পাওয়া যায়নি।
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                তথ্য যাচাই শেষে স্ট্যাটাস Running এ পরিবর্তন করতে পারেন।
              </span>
              <button
                onClick={() => setViewFormOrder(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-white rounded-xl text-xs font-bold"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Enlarge Modal */}
      {selectedScreenshotOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  পেমেন্ট রিসিট স্ক্রিনশট প্রুফ
                </h3>
                <span className="text-xs text-gray-400">
                  অর্ডার: {selectedScreenshotOrder.id} • গ্রাহক: {selectedScreenshotOrder.userName}
                </span>
              </div>
              <button
                onClick={() => setSelectedScreenshotOrder(null)}
                className="p-1 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕ বন্ধ করুন
              </button>
            </div>

            <div className="py-4 text-center">
              <img
                src={selectedScreenshotOrder.screenshotUrl}
                alt="Payment proof"
                className="max-h-[60vh] mx-auto object-contain rounded-xl border border-gray-200 dark:border-gray-700"
              />
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">প্রেরক নাম্বার:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{selectedScreenshotOrder.senderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedScreenshotOrder.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">পরিশোধিত মূল্য:</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400">৳{selectedScreenshotOrder.paidAmount}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedScreenshotOrder(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl text-xs font-semibold"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {statusDialogOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              অর্ডার স্ট্যাটাস পরিবর্তন: <span className="uppercase text-rose-600">{targetStatus}</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              অর্ডার আইডি: {statusDialogOrder.id} • গ্রাহক: {statusDialogOrder.userName}
            </p>

            <form onSubmit={handleConfirmStatusChange} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  গ্রাহকের জন্য স্ট্যাটাস মেসেজ / নোট:
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusDialogOrder(null)}
                  className="px-3 py-1.5 text-xs text-gray-500 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md ${
                    targetStatus === 'approved' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : targetStatus === 'processing'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : targetStatus === 'running'
                      ? 'bg-cyan-600 hover:bg-cyan-700'
                      : targetStatus === 'completed'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  নিশ্চিত করুন ({targetStatus})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Modal: Request Correct Payment Proof / TrxID */}
      {paymentProofDialogOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white dark:bg-gray-850 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    পুনরায় পেমেন্ট প্রুফ রিকোয়েস্ট
                  </h3>
                  <span className="text-[11px] text-gray-500 font-mono">
                    অর্ডার: #{paymentProofDialogOrder.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPaymentProofDialogOrder(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Order Info Summary */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">গ্রাহক:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{paymentProofDialogOrder.userName} ({paymentProofDialogOrder.userPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">সার্ভিস:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{paymentProofDialogOrder.serviceName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">বর্তমান TrxID:</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                    {paymentProofDialogOrder.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">টাকার পরিমাণ:</span>
                  <span className="font-bold text-emerald-600">৳{paymentProofDialogOrder.paidAmount}</span>
                </div>
              </div>

              {/* Quick Preset Reasons */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  দ্রুত কারণ সিলেক্ট করুন:
                </label>
                <div className="space-y-1">
                  {[
                    'আপনার প্রদত্ত Transaction ID টি ভুল বা অকার্যকর। অনুগ্রহ করে সঠিক TrxID দিন।',
                    'প্রদত্ত TrxID অনুযায়ী আমাদের একাউন্টে টাকা পৌঁছায়নি। সঠিক TrxID ও প্রেরক নাম্বার দিন।',
                    'পেমেন্ট স্ক্রিনশট অস্পষ্ট বা অমিল। দয়া করে পরিষ্কার স্লিপের ছবি ও সঠিক TrxID দিন।',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPaymentProofReason(preset)}
                      className="w-full text-left p-2 rounded-lg text-[11px] bg-gray-100 hover:bg-amber-50 hover:text-amber-900 dark:bg-gray-800 dark:hover:bg-amber-950/40 text-gray-700 dark:text-gray-300 transition-colors border border-transparent hover:border-amber-300 dark:hover:border-amber-700 cursor-pointer"
                    >
                      • {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom reason input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  গ্রাহককে প্রদর্শিত বার্তা (নোট):
                </label>
                <textarea
                  rows={3}
                  value={paymentProofReason}
                  onChange={(e) => setPaymentProofReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="গ্রাহকের TrxID বা পেমেন্টে কী ভুল হয়েছে তা বিস্তারিত লিখুন..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentProofDialogOrder(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!paymentProofReason.trim()) {
                      showToast('অনুগ্রহ করে গ্রাহককে নির্দেশনামূলক একটি কারণ লিখুন।', 'warning');
                      return;
                    }
                    requestPaymentProof(paymentProofDialogOrder.id, paymentProofReason.trim());
                    setPaymentProofDialogOrder(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>গ্রাহককে অনুরোধ পাঠান</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <ConfirmDeleteModal
          isOpen={!!orderToDelete}
          title="অর্ডার ডিলিট নিশ্চিত করুন"
          message={`আপনি কি নিশ্চিতভাবে অর্ডার #${orderToDelete.id} (${orderToDelete.serviceName}) মুছে ফেলতে চান? এটি অপরিবর্তনযোগ্য।`}
          onConfirm={() => {
            deleteOrder(orderToDelete.id);
            setOrderToDelete(null);
          }}
          onCancel={() => setOrderToDelete(null)}
        />
      )}

    </div>
  );
};
