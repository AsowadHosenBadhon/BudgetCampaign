import React, { useState } from 'react';
import { 
  Clock, CheckCircle2, XCircle, ShoppingBag, 
  ExternalLink, ArrowRight, ShieldAlert, Eye, MessageSquare,
  FileCheck2, PlayCircle, Sparkles, CheckCircle, AlertCircle,
  Star, RotateCcw, Upload, Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { OrderFormModal } from './OrderFormModal';
import { OrderReviewModal } from './OrderReviewModal';

export const OrdersPage: React.FC = () => {
  const { orders, reviews, currentUser, setActiveTab, setIsAuthModalOpen, resubmitPaymentProof, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewScreenshotOrder, setViewScreenshotOrder] = useState<Order | null>(null);
  const [activeFormOrder, setActiveFormOrder] = useState<Order | null>(null);
  const [viewDetailsOrder, setViewDetailsOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  // Payment proof re-submission state
  const [resubmitProofOrder, setResubmitProofOrder] = useState<Order | null>(null);
  const [newTrxId, setNewTrxId] = useState<string>('');
  const [newSenderNumber, setNewSenderNumber] = useState<string>('');
  const [newScreenshotUrl, setNewScreenshotUrl] = useState<string>('');

  if (!currentUser) {
    return (
      <div className="py-20 max-w-md mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          আপনার অর্ডার দেখতে লগইন করুন
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          আপনার পূর্বে করা সকল সার্ভিস অর্ডার, পেমেন্ট ট্রানজেকশন এবং ডেলিভারি স্ট্যাটাস দেখতে অ্যাকাউন্টে প্রবেশ করুন।
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="mt-6 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
        >
          লগইন / সাইন আপ করুন
        </button>
      </div>
    );
  }

  // Filter user's own orders
  const userOrders = orders.filter((o) => o.userId === currentUser.id);

  const filteredOrders = userOrders.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved (অনুমোদিত)</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>Processing (ফর্ম পূরণ প্রয়োজন)</span>
          </span>
        );
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Running (কাজ চলমান)</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Completed (সম্পন্ন)</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected (বাতিলকৃত)</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending (অপেক্ষমান)</span>
          </span>
        );
    }
  };

  return (
    <div className="pb-24 pt-4 sm:pt-6 space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full">
            আমার অর্ডারসমূহ
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            অর্ডার ও ডেলিভারি ট্র্যাকিং
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            আপনার অর্ডার স্ট্যাটাস, প্রয়োজনীয় ফর্ম পূরণ ও লাইভ আপডেট এখান থেকে মনিটর করুন।
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl scrollbar-none">
          {[
            { id: 'all', label: 'সবগুলো' },
            { id: 'pending', label: 'Pending' },
            { id: 'approved', label: 'Approved' },
            { id: 'processing', label: 'Processing' },
            { id: 'running', label: 'Running' },
            { id: 'completed', label: 'Completed' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-200 dark:border-gray-700 p-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
            কোন অর্ডার পাওয়া যায়নি
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            আপনি এখনও এই ক্যাটাগরিতে কোন সার্ভিস অর্ডার করেননি। আমাদের সার্ভিসসমূহ থেকে আপনার পছন্দেরটি বেছে নিন।
          </p>
          <button
            onClick={() => setActiveTab('services')}
            className="mt-5 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>সার্ভিস ব্রাউজ করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`bg-white dark:bg-gray-800 rounded-3xl border shadow-sm transition-all overflow-hidden p-5 sm:p-6 ${
                order.status === 'processing'
                  ? 'border-purple-300 dark:border-purple-700 ring-2 ring-purple-400/20'
                  : 'border-gray-200 dark:border-gray-700/80 hover:shadow-md'
              }`}
            >
              {/* Top row: Order ID, Date, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-700/60">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md">
                    #{order.id}
                  </span>
                  <span className="text-xs text-gray-400">
                    তারিখ: <strong className="text-gray-600 dark:text-gray-300 font-normal">{order.createdAt}</strong>
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Middle row: Service Name, Amount, TrxID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
                
                {/* Service Name */}
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    সার্ভিস / প্যাকেজ
                  </div>
                  <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mt-0.5">
                    {order.serviceName}
                  </div>
                </div>

                {/* Paid Amount */}
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    পরিশোধিত মূল্য
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">
                    ৳{order.paidAmount.toLocaleString()}
                  </div>
                </div>

                {/* Transaction ID & Method */}
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    TrxID ও পেমেন্ট মেথড
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                      {order.transactionId}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      ({order.paymentMethod})
                    </span>
                  </div>
                </div>

              </div>

              {/* Requirement: Payment Proof Re-submission Alert if requested by Admin */}
              {order.paymentProofRequested && (
                <div className="my-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 dark:border-rose-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-rose-950 dark:text-rose-200">
                          সঠিক Transaction ID / পেমেন্ট প্রুফ জমা দিন
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200">
                          Action Required
                        </span>
                      </div>
                      <p className="text-xs text-rose-800 dark:text-rose-300 mt-1 font-medium">
                        <strong>অ্যাডমিনের নোট:</strong> {order.paymentProofRequestNote || 'আপনার প্রদত্ত Transaction ID যাচাই করা যায়নি। অনুগ্রহ করে সঠিক TrxID ও পেমেন্ট প্রুফ পুনরায় জমা দিন।'}
                      </p>
                    </div>
                  </div>

                  <button
                    id={`resubmit-proof-btn-${order.id}`}
                    onClick={() => {
                      setResubmitProofOrder(order);
                      setNewTrxId(order.transactionId || '');
                      setNewSenderNumber(order.senderNumber || '');
                      setNewScreenshotUrl(order.screenshotUrl || '');
                    }}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-rose-600/30 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>সঠিক TrxID / প্রুফ জমা দিন</span>
                  </button>
                </div>
              )}

              {/* Requirement 3: Processing Action Banner & "Complete Required Form" Button */}
              {order.status === 'processing' && (
                <div className="my-3 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-purple-950 dark:text-purple-200">
                        কাস্টম তথ্য ফরম পূরণ প্রয়োজন
                      </h4>
                      <p className="text-xs text-purple-800 dark:text-purple-300 mt-0.5">
                        অ্যাডমিন আপনার অর্ডার অনুমোদন করেছে। কাজ শুরু করতে সার্ভিসটির জন্য নির্ধারিত তথ্য প্রদান করুন।
                      </p>
                    </div>
                  </div>

                  {/* "Complete Required Form" Button */}
                  <button
                    id={`complete-form-btn-${order.id}`}
                    onClick={() => setActiveFormOrder(order)}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-purple-600/30 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Complete Required Form</span>
                  </button>
                </div>
              )}

              {/* If Order is running or completed and form was submitted */}
              {(order.status === 'running' || order.status === 'completed') && order.formSubmission && (
                <div className="my-2 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-cyan-900 dark:text-cyan-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                    <span>প্রয়োজনীয় ফর্ম পূরণ সম্পন্ন হয়েছে ({order.formSubmission.submittedAt})</span>
                  </div>
                  <button
                    onClick={() => setViewDetailsOrder(order)}
                    className="text-xs font-bold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 underline cursor-pointer"
                  >
                    জমা দেওয়া তথ্য দেখুন
                  </button>
                </div>
              )}

              {/* Requirement: Review Action Banner for Completed Orders */}
              {order.status === 'completed' && (() => {
                const existingReview = reviews.find(
                  (r) => (r.orderId === order.id) || (r.serviceId === order.serviceId && r.userId === currentUser.id)
                );

                return (
                  <div className="my-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/30 dark:to-emerald-950/30 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
                        <Star className="w-5 h-5 fill-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                            {existingReview ? 'আপনার রিভিউ জমা হয়েছে' : 'সার্ভিসটি সম্পন্ন হয়েছে! রিভিউ দিন'}
                          </h4>
                          {existingReview && (
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                              existingReview.isApproved
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                            }`}>
                              {existingReview.isApproved ? 'Approved' : 'Pending Approval'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                          {existingReview 
                            ? `আপনি ${existingReview.rating} স্টার রেটিং দিয়েছেন। অ্যাডমিন প্যানেল থেকে নিয়ন্ত্রণের পর মূল পেজে প্রদর্শিত হবে।`
                            : 'সার্ভিসের মান ও ডেলিভারি কেমন ছিল? আপনার মতামত আমাদের সেবার মান উন্নত করতে সাহায্য করবে।'}
                        </p>
                      </div>
                    </div>

                    <button
                      id={`review-btn-${order.id}`}
                      onClick={() => setReviewOrder(order)}
                      className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                        existingReview
                          ? 'bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/40'
                          : 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white shadow-amber-500/25 active:scale-98'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${existingReview ? 'fill-amber-500' : 'fill-white'}`} />
                      <span>{existingReview ? 'রিভিউ দেখুন / আপডেট' : 'রিভিউ প্রদান করুন'}</span>
                    </button>
                  </div>
                );
              })()}

              {/* Status Note or Feedback */}
              {order.statusNote && (
                <div className={`mt-2 p-3 rounded-xl text-xs flex items-start gap-2 ${
                  order.status === 'completed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                    : order.status === 'rejected'
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                }`}>
                  <span className="font-bold shrink-0">অ্যাডমিন মেসেজ:</span>
                  <span>{order.statusNote}</span>
                </div>
              )}

              {/* Additional notes & screenshot trigger */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-gray-500 dark:text-gray-400">
                  প্রেরক নাম্বার: <strong className="font-mono text-gray-700 dark:text-gray-300">{order.senderNumber}</strong>
                  {order.notes && (
                    <span className="ml-3 italic">নোট: "{order.notes}"</span>
                  )}
                </div>

                {order.screenshotUrl && (
                  <button
                    onClick={() => setViewScreenshotOrder(order)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>পেমেন্ট রিসিট দেখুন</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Active Form Submission Modal */}
      {activeFormOrder && (
        <OrderFormModal
          order={activeFormOrder}
          onClose={() => setActiveFormOrder(null)}
        />
      )}

      {/* View Submitted Form Details Modal */}
      {viewDetailsOrder && viewDetailsOrder.formSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div 
            className="relative max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-cyan-600" />
                <span>আপনার জমা দেওয়া ফর্ম তথ্য</span>
              </h3>
              <button
                onClick={() => setViewDetailsOrder(null)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold"
              >
                ✕ বন্ধ করুন
              </button>
            </div>
            
            <div className="py-4 space-y-3 max-h-96 overflow-y-auto">
              <div className="text-xs text-gray-400">
                সাবমিট তারিখ: {viewDetailsOrder.formSubmission.submittedAt}
              </div>

              {Object.entries(viewDetailsOrder.formSubmission.values).map(([key, val]) => (
                <div key={key} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-[11px] font-bold text-gray-500 uppercase">{key}</div>
                  {typeof val === 'string' && val.startsWith('data:image') ? (
                    <img src={val} alt="Uploaded attachment" className="mt-2 max-h-40 rounded-lg border border-gray-200 dark:border-gray-700" />
                  ) : (
                    <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-1 break-all">
                      {String(val || 'N/A')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      {viewScreenshotOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div 
            className="relative max-w-lg w-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                পেমেন্ট স্ক্রিনশট - #{viewScreenshotOrder.id}
              </h3>
              <button
                onClick={() => setViewScreenshotOrder(null)}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold"
              >
                ✕ বন্ধ করুন
              </button>
            </div>
            <div className="py-4">
              <img
                src={viewScreenshotOrder.screenshotUrl}
                alt="Payment proof screenshot"
                className="w-full max-h-[65vh] object-contain rounded-2xl border border-gray-200 dark:border-gray-700"
              />
            </div>
            <div className="text-center text-xs text-gray-500">
              TrxID: <strong>{viewScreenshotOrder.transactionId}</strong> • পরিমাণ: ৳{viewScreenshotOrder.paidAmount}
            </div>
          </div>
        </div>
      )}

      {/* Order Review Submission Modal */}
      {reviewOrder && (
        <OrderReviewModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          existingReview={reviews.find(
            (r) => (r.orderId === reviewOrder.id) || (r.serviceId === reviewOrder.serviceId && r.userId === currentUser.id)
          )}
        />
      )}

      {/* Resubmit Payment Proof Modal */}
      {resubmitProofOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    সঠিক পেমেন্ট প্রুফ জমা দিন
                  </h3>
                  <span className="text-[11px] text-gray-400 font-mono">
                    অর্ডার: #{resubmitProofOrder.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setResubmitProofOrder(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Admin message banner */}
            <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200 block mb-0.5">
                অ্যাডমিনের কারণ ও নির্দেশনা:
              </span>
              <p className="text-amber-800 dark:text-amber-300">
                {resubmitProofOrder.paymentProofRequestNote || 'আপনার প্রদত্ত Transaction ID যাচাই করা সম্ভব হয়নি। অনুগ্রহ করে সঠিক TrxID ও পেমেন্ট প্রুফ পুনরায় জমা দিন।'}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTrxId.trim()) {
                  showToast('সঠিক Transaction ID দিন।', 'warning');
                  return;
                }
                if (!newSenderNumber.trim()) {
                  showToast('টাকা প্রেরকের মোবাইল নাম্বার দিন।', 'warning');
                  return;
                }
                const result = resubmitPaymentProof(resubmitProofOrder.id, {
                  transactionId: newTrxId,
                  senderNumber: newSenderNumber,
                  screenshotUrl: newScreenshotUrl || resubmitProofOrder.screenshotUrl,
                });
                if (result.success) {
                  setResubmitProofOrder(null);
                }
              }}
              className="mt-4 space-y-3.5"
            >
              {/* Order Info */}
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-xs space-y-1">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>সার্ভিস:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{resubmitProofOrder.serviceName}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>পেমেন্ট মেথড:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{resubmitProofOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>পরিশোধের পরিমাণ:</span>
                  <span className="font-bold text-rose-600">৳{resubmitProofOrder.paidAmount}</span>
                </div>
              </div>

              {/* Transaction ID input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  সঠিক Transaction ID (TrxID) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTrxId}
                  onChange={(e) => setNewTrxId(e.target.value.toUpperCase())}
                  placeholder="যেমন: BL91X4KP8Q"
                  className="w-full px-3.5 py-2.5 font-mono text-sm tracking-wider uppercase bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-gray-900 dark:text-white"
                />
              </div>

              {/* Sender Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  যে নাম্বার থেকে টাকা পাঠানো হয়েছে <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={newSenderNumber}
                  onChange={(e) => setNewSenderNumber(e.target.value)}
                  placeholder="যেমন: 017XXXXXXXX"
                  className="w-full px-3.5 py-2 text-xs font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-gray-900 dark:text-white"
                />
              </div>

              {/* Payment Screenshot (Optional upload or replace) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  পেমেন্ট স্লিপের স্ক্রিনশট (ঐচ্ছিক)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                      নতুন স্ক্রিনশট আপলোড করুন
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewScreenshotUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {newScreenshotUrl && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <img src={newScreenshotUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setResubmitProofOrder(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>সঠিক তথ্য জমা দিন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
