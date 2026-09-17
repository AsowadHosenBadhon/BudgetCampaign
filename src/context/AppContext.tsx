import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Service, Order, PaymentMethod, Post, Review, VideoConfig, 
  OrderStatus, UserStatus, Category, WebsiteBranding 
} from '../types';
import { 
  initialUsers, initialServices, initialOrders, 
  initialPaymentMethods, initialPosts, initialReviews, initialVideoConfig,
  initialCategories, initialBranding 
} from '../data/initialData';

export type UserTab = 'home' | 'services' | 'orders' | 'profile';
export type AdminTab = 'dashboard' | 'products' | 'categories' | 'branding' | 'orders' | 'payments' | 'users' | 'posts' | 'reviews';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  // Auth & User
  currentUser: User | null;
  users: User[];
  login: (emailOrPhone: string, pass: string) => boolean;
  loginWithGoogle: (customEmail?: string, customName?: string, customAvatar?: string) => boolean;
  register: (name: string, email: string, phone: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  updateUserProfile: (userId: string, data: Partial<User>) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  deleteUser: (userId: string) => void;
  changePassword: (userId: string, oldPass: string, newPass: string) => { success: boolean; message: string };
  resetPasswordRequest: (emailOrPhone: string) => { success: boolean; message: string };
  switchUserRole: (role: 'user' | 'admin') => void;

  // Navigation
  activeTab: UserTab;
  setActiveTab: (tab: UserTab) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  adminActiveTab: AdminTab;
  setAdminActiveTab: (tab: AdminTab) => void;

  // Website Branding
  branding: WebsiteBranding;
  updateBranding: (data: Partial<WebsiteBranding>) => void;

  // Categories
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Services
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    paidAmount: number;
    paymentMethod: string;
    senderNumber: string;
    transactionId: string;
    screenshotUrl?: string;
    notes?: string;
  }) => { success: boolean; message: string; orderId?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus, statusNote?: string) => void;
  requestPaymentProof: (orderId: string, reasonNote: string) => void;
  resubmitPaymentProof: (orderId: string, data: { transactionId: string; senderNumber: string; screenshotUrl?: string }) => { success: boolean; message: string };
  submitOrderForm: (orderId: string, formData: Record<string, string>) => void;
  deleteOrder: (orderId: string) => void;

  // Payment Methods
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;

  // Posts & Video
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'views' | 'likes'>) => void;
  updatePost: (id: string, data: Partial<Post>) => void;
  deletePost: (id: string) => void;
  videoConfig: VideoConfig;
  updateVideoConfig: (config: Partial<VideoConfig>) => void;

  // Reviews
  reviews: Review[];
  addReview: (data: { serviceName: string; rating: number; comment: string; serviceId?: string; orderId?: string }) => void;
  approveReview: (reviewId: string) => void;
  rejectReview: (reviewId: string) => void;
  deleteReview: (reviewId: string) => void;

  // Modals & UI
  selectedServiceForPurchase: Service | null;
  setSelectedServiceForPurchase: (srv: Service | null) => void;
  selectedPostForDetail: Post | null;
  setSelectedPostForDetail: (post: Post | null) => void;
  initiatePurchase: (service: Service) => void;
  promptServiceForPurchase: Service | null;
  setPromptServiceForPurchase: (srv: Service | null) => void;
  isPurchaseAuthPromptOpen: boolean;
  setIsPurchaseAuthPromptOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  
  // Theme & Toast
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sp_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sp_current_user');
    if (saved) return JSON.parse(saved);
    // Default to the demo customer account so app is ready to explore immediately
    return initialUsers[1];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('sp_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [branding, setBranding] = useState<WebsiteBranding>(() => {
    const saved = localStorage.getItem('sp_branding');
    return saved ? JSON.parse(saved) : initialBranding;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('sp_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sp_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('sp_payment_methods');
    return saved ? JSON.parse(saved) : initialPaymentMethods;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('sp_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('sp_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [videoConfig, setVideoConfig] = useState<VideoConfig>(() => {
    const saved = localStorage.getItem('sp_video');
    return saved ? JSON.parse(saved) : initialVideoConfig;
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState<UserTab>('home');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTab>('dashboard');

  // Purchase modal
  const [selectedServiceForPurchase, setSelectedServiceForPurchase] = useState<Service | null>(null);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<Post | null>(null);
  const [promptServiceForPurchase, setPromptServiceForPurchase] = useState<Service | null>(null);
  const [isPurchaseAuthPromptOpen, setIsPurchaseAuthPromptOpen] = useState<boolean>(false);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sp_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sp_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sp_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sp_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('sp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sp_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('sp_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('sp_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sp_branding', JSON.stringify(branding));
    if (branding.name) {
      document.title = `${branding.name}${branding.tagline ? ` - ${branding.tagline}` : ''}`;
    }
    if (branding.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = branding.favicon;
    }
  }, [branding]);

  useEffect(() => {
    localStorage.setItem('sp_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sp_video', JSON.stringify(videoConfig));
  }, [videoConfig]);

  useEffect(() => {
    localStorage.setItem('sp_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Functions
  const continuePendingPurchase = () => {
    if (promptServiceForPurchase) {
      const srv = promptServiceForPurchase;
      setSelectedServiceForPurchase(srv);
      setPromptServiceForPurchase(null);
      setIsPurchaseAuthPromptOpen(false);
      setIsAuthModalOpen(false);
      showToast(`লগইন সম্পন্ন হয়েছে! এখন "${srv.nameBn || srv.name}" সার্ভিসটি অর্ডার করুন।`, 'success');
    }
  };

  const initiatePurchase = (service: Service) => {
    if (!currentUser) {
      setPromptServiceForPurchase(service);
      setIsPurchaseAuthPromptOpen(true);
    } else {
      setSelectedServiceForPurchase(service);
    }
  };

  const loginWithGoogle = (customEmail?: string, customName?: string, customAvatar?: string): boolean => {
    const googleEmail = (customEmail || 'customer@gmail.com').trim().toLowerCase();
    const googleName = (customName || 'Google User').trim();
    const googleAvatar = customAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${googleEmail}`;

    let user = users.find((u) => u.email.toLowerCase() === googleEmail);

    if (!user) {
      user = {
        id: 'usr_g_' + Date.now(),
        name: googleName,
        email: googleEmail,
        phone: '', // Requirement 6: Mobile number field must remain empty on Google login
        role: 'user',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: googleAvatar,
      };
      setUsers((prev) => [...prev, user!]);
    } else if (customAvatar) {
      user = { ...user, avatar: customAvatar };
      setUsers((prev) => prev.map(u => u.id === user!.id ? user! : u));
    }

    if (user.status === 'banned') {
      showToast('আপনার অ্যাকাউন্টটি নিষিদ্ধ (Banned) করা হয়েছে।', 'error');
      return false;
    }
    if (user.status === 'suspended') {
      showToast('আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত (Suspended) আছে।', 'warning');
      return false;
    }

    setCurrentUser(user);
    showToast(`গুগল একাউন্ট দিয়ে স্বাগতম, ${user.name}!`, 'success');
    setIsAuthModalOpen(false);
    setIsPurchaseAuthPromptOpen(false);
    continuePendingPurchase();
    return true;
  };

  const login = (emailOrPhone: string, pass: string): boolean => {
    const clean = emailOrPhone.trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === clean || u.phone === clean
    );

    if (!user) {
      showToast('ইউজার বা পাসওয়ার্ড সঠিক নয়!', 'error');
      return false;
    }

    if (user.status === 'banned') {
      showToast('আপনার অ্যাকাউন্টটি নিষিদ্ধ (Banned) করা হয়েছে। সাপোর্টে যোগাযোগ করুন।', 'error');
      return false;
    }

    if (user.status === 'suspended') {
      showToast('আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত (Suspended) আছে।', 'warning');
      return false;
    }

    setCurrentUser(user);
    showToast(`স্বাগতম, ${user.name}!`, 'success');
    setIsAuthModalOpen(false);
    continuePendingPurchase();
    return true;
  };

  const register = (name: string, email: string, phone: string, pass: string) => {
    if (!name.trim() || !email.trim() || !phone.trim() || !pass.trim()) {
      return { success: false, message: 'সবগুলো তথ্য সঠিকভাবে পূরণ করুন!' };
    }

    const existing = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() || u.phone === phone.trim()
    );

    if (existing) {
      return { success: false, message: 'এই ইমেইল বা ফোন নাম্বার দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে।' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: 'user',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      password: pass,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
    setIsAuthModalOpen(false);
    continuePendingPurchase();
    return { success: true, message: 'রেজিস্ট্রেশন সফল হয়েছে!' };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
    setActiveTab('home');
    showToast('লগ আউট সম্পন্ন হয়েছে', 'info');
  };

  const updateUserProfile = (userId: string, data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
    }
    showToast('প্রোফাইল আপডেট সম্পন্ন হয়েছে!', 'success');
  };

  const updateUserStatus = (userId: string, status: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`ইউজার স্ট্যাটাস পরিবর্তন হয়েছে: ${status}`, 'info');
  };

  const deleteUser = (userId: string) => {
    if (currentUser && currentUser.id === userId) {
      showToast('বর্তমান লগইন থাকা ইউজার মুছে ফেলা সম্ভব নয়!', 'warning');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('ইউজার সফলভাবে মুছে ফেলা হয়েছে', 'info');
  };

  const changePassword = (userId: string, oldPass: string, newPass: string) => {
    if (!newPass || newPass.length < 4) {
      return { success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' };
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: newPass } : u))
    );
    showToast('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!', 'success');
    return { success: true, message: 'পাসওয়ার্ড পরিবর্তিত হয়েছে!' };
  };

  const resetPasswordRequest = (emailOrPhone: string) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === emailOrPhone.trim().toLowerCase() || u.phone === emailOrPhone.trim()
    );
    if (!user) {
      return { success: false, message: 'কোন অ্যাকাউন্ট খুঁজে পাওয়া যায়নি!' };
    }
    // Simulation: Password reset code or link
    return { success: true, message: `পাসওয়ার্ড রিসেট কোড আপনার মোবাইল/ইমেইলে পাঠানো হয়েছে (${user.email})` };
  };

  const switchUserRole = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      // Find admin user or promote
      const adminUser = users.find((u) => u.role === 'admin') || initialUsers[0];
      setCurrentUser(adminUser);
      setIsAdminMode(true);
      showToast('Admin Mode সক্রিয় করা হয়েছে', 'info');
    } else {
      const regularUser = users.find((u) => u.role === 'user') || initialUsers[1];
      setCurrentUser(regularUser);
      setIsAdminMode(false);
      showToast('User Mode সক্রিয় করা হয়েছে', 'info');
    }
  };

  // Service Management
  const addService = (data: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...data,
      id: 'srv_' + Date.now(),
    };
    setServices((prev) => [newService, ...prev]);
    showToast('নতুন সার্ভিস সফলভাবে যুক্ত হয়েছে!', 'success');
  };

  const updateService = (id: string, data: Partial<Service>) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
    showToast('সার্ভিস তথ্য আপডেট হয়েছে!', 'success');
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('সার্ভিস ডিলিট করা হয়েছে', 'info');
  };

  // Order Management
  const createOrder = (orderData: {
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    paidAmount: number;
    paymentMethod: string;
    senderNumber: string;
    transactionId: string;
    screenshotUrl?: string;
    notes?: string;
  }) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, message: 'অর্ডার করতে অনুগ্রহ করে লগইন করুন।' };
    }

    if (currentUser.status === 'banned' || currentUser.status === 'suspended') {
      return { success: false, message: 'আপনার অ্যাকাউন্ট থেকে অর্ডার করা সম্ভব নয়।' };
    }

    // Security check: validate TrxID format
    const cleanTrx = orderData.transactionId.trim().toUpperCase();
    if (!cleanTrx || cleanTrx.length < 6) {
      return { success: false, message: 'সঠিক Transaction ID (ন্যূনতম ৬ ক্যারেক্টার) দিন।' };
    }

    // Check duplicate TrxID within orders to prevent duplicate submission
    const duplicateTrx = orders.find(
      (o) => o.transactionId.toUpperCase() === cleanTrx && o.status !== 'rejected'
    );
    if (duplicateTrx) {
      return { success: false, message: 'এই Transaction ID টি ইতিমধ্যে একবার ব্যবহার করা হয়েছে!' };
    }

    if (!orderData.senderNumber || orderData.senderNumber.length < 11) {
      return { success: false, message: 'সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন।' };
    }

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newOrder: Order = {
      id: orderId,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      userEmail: currentUser.email,
      serviceId: orderData.serviceId,
      serviceName: orderData.serviceName,
      servicePrice: orderData.servicePrice,
      paidAmount: orderData.paidAmount,
      paymentMethod: orderData.paymentMethod,
      senderNumber: orderData.senderNumber,
      transactionId: cleanTrx,
      screenshotUrl: orderData.screenshotUrl || '',
      notes: orderData.notes || '',
      status: 'pending',
      statusNote: 'আপনার পেমেন্ট ভেরিফিকেশন চলছে। দ্রুত আপডেট পাবেন।',
      createdAt: dateStr,
      updatedAt: dateStr,
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`অর্ডার সাবমিট সফল হয়েছে! আইডি: ${orderId}`, 'success');
    return { success: true, message: 'আপনার অর্ডারটি পেন্ডিং হিসেবে গ্রহণ করা হয়েছে!', orderId };
  };

  const updateBranding = (data: Partial<WebsiteBranding>) => {
    setBranding((prev) => ({ ...prev, ...data }));
    showToast('ওয়েবসাইট ব্র্যান্ডিং সেটিংস সফলভাবে সেভ হয়েছে!', 'success');
  };

  const addCategory = (data: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...data,
      id: 'cat_' + Date.now(),
    };
    setCategories((prev) => [...prev, newCat]);
    showToast('নতুন ক্যাটাগরি তৈরি সম্পন্ন হয়েছে!', 'success');
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    showToast('ক্যাটাগরি আপডেট সম্পন্ন হয়েছে!', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('ক্যাটাগরি মুছে ফেলা হয়েছে!', 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, statusNote?: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const defaultNotes: Record<OrderStatus, string> = {
      pending: 'পেমেন্ট যাচাইকরণ চলমান।',
      approved: 'পেমেন্ট ও অর্ডার অনুমোদিত হয়েছে।',
      processing: 'আপনার রিকয়ার্ড সার্ভিস ফর্মটি পূরণ করার অনুরোধ করা হচ্ছে।',
      running: 'আপনার সার্ভিসের কাজ সফলভাবে চলমান (Running) রয়েছে।',
      completed: 'সার্ভিস ডেলিভারি সম্পন্ন হয়েছে। ধন্যবাদ আমাদের সেবা গ্রহণের জন্য!',
      rejected: 'পেমেন্ট বা তথ্যে অসঙ্গতির কারণে অর্ডার বাতিল করা হয়েছে।',
    };

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              statusNote: statusNote || defaultNotes[status] || 'স্ট্যাটাস আপডেট হয়েছে।',
              // If status moved out of pending/rejected, clear paymentProofRequested
              paymentProofRequested: status === 'pending' || status === 'rejected' ? o.paymentProofRequested : false,
              updatedAt: dateStr,
            }
          : o
      )
    );
    showToast(`অর্ডারের স্ট্যাটাস পরিবর্তন: ${status.toUpperCase()}`, 'info');
  };

  const requestPaymentProof = (orderId: string, reasonNote: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentProofRequested: true,
              paymentProofRequestNote: reasonNote || 'আপনার প্রদত্ত Transaction ID বা পেমেন্ট তথ্যে অসঙ্গতি রয়েছে। অনুগ্রহ করে সঠিক TrxID ও পেমেন্ট প্রুফ পুনরায় জমা দিন।',
              statusNote: reasonNote || 'পেমেন্ট ট্রানজেকশন আইডি পুনরায় সাবমিট করার অনুরোধ করা হয়েছে।',
              updatedAt: dateStr,
            }
          : o
      )
    );
    showToast(`অর্ডার #${orderId} এর জন্য গ্রাহককে পুনরায় পেমেন্ট প্রুফ জমা দেওয়ার অনুরোধ পাঠানো হয়েছে!`, 'success');
  };

  const resubmitPaymentProof = (orderId: string, data: { transactionId: string; senderNumber: string; screenshotUrl?: string }) => {
    const cleanTrx = data.transactionId.trim().toUpperCase();
    if (!cleanTrx || cleanTrx.length < 5) {
      return { success: false, message: 'দয়া করে সঠিক Transaction ID (ন্যূনতম ৫ অক্ষর) প্রদান করুন।' };
    }
    if (!data.senderNumber || data.senderNumber.length < 11) {
      return { success: false, message: 'সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন।' };
    }

    // Check duplicate TrxID within other orders
    const duplicateTrx = orders.find(
      (o) => o.id !== orderId && o.transactionId.toUpperCase() === cleanTrx && o.status !== 'rejected'
    );
    if (duplicateTrx) {
      return { success: false, message: 'এই Transaction ID টি অন্য একটি অর্ডারে ইতিমধ্যে ব্যবহার করা হয়েছে!' };
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              transactionId: cleanTrx,
              senderNumber: data.senderNumber.trim(),
              screenshotUrl: data.screenshotUrl || o.screenshotUrl,
              paymentProofRequested: false, // Reset flag
              status: 'pending', // Re-enter pending verification
              statusNote: 'সংশোধিত পেমেন্ট প্রুফ ও TrxID পুনরায় জমা দেওয়া হয়েছে। অ্যাডমিন রিভিউ করছেন।',
              updatedAt: dateStr,
            }
          : o
      )
    );

    showToast('পেমেন্ট প্রুফ ও TrxID সফলভাবে পুনরায় জমা দেওয়া হয়েছে!', 'success');
    return { success: true, message: 'সফলভাবে জমা হয়েছে' };
  };

  const submitOrderForm = (orderId: string, formData: Record<string, string>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              formSubmission: {
                submittedAt: dateStr,
                data: formData,
                isReviewed: false,
              },
              statusNote: 'আপনার রিকয়ার্ড ফর্ম সাবমিট হয়েছে। অ্যাডমিন রিভিউ করে সার্ভিস রানিং করবেন।',
              updatedAt: dateStr,
            }
          : o
      )
    );
    showToast('আপনার সার্ভিস রিকয়ারমেন্ট ফর্ম সফলভাবে সাবমিট হয়েছে!', 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('অর্ডার মুছে ফেলা হয়েছে', 'info');
  };

  // Payment Methods
  const addPaymentMethod = (data: Omit<PaymentMethod, 'id'>) => {
    const newMethod: PaymentMethod = {
      ...data,
      id: 'pm_' + Date.now(),
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
    showToast('পেমেন্ট মেথড যোগ করা হয়েছে!', 'success');
  };

  const updatePaymentMethod = (id: string, data: Partial<PaymentMethod>) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => (pm.id === id ? { ...pm, ...data } : pm))
    );
    showToast('পেমেন্ট মেথড আপডেট হয়েছে!', 'success');
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    showToast('পেমেন্ট মেথড ডিলিট করা হয়েছে', 'info');
  };

  // Posts & Video
  const addPost = (data: Omit<Post, 'id' | 'views' | 'likes'>) => {
    const newPost: Post = {
      ...data,
      id: 'post_' + Date.now(),
      views: 1,
      likes: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    showToast('নতুন পোস্ট প্রকাশিত হয়েছে!', 'success');
  };

  const updatePost = (id: string, data: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    showToast('পোস্ট আপডেট সম্পন্ন!', 'success');
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('পোস্ট ডিলিট করা হয়েছে', 'info');
  };

  const updateVideoConfig = (config: Partial<VideoConfig>) => {
    setVideoConfig((prev) => ({ ...prev, ...config }));
    showToast('ইউটিউব ভিডিও সেটিংস সেভ করা হয়েছে!', 'success');
  };

  // Reviews
  const addReview = (data: { serviceName: string; rating: number; comment: string; serviceId?: string; orderId?: string }) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const newRev: Review = {
      id: 'rev_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      orderId: data.orderId,
      serviceName: data.serviceName,
      serviceId: data.serviceId,
      rating: data.rating,
      comment: data.comment,
      date: new Date().toISOString().split('T')[0],
      isApproved: false, // New reviews submit to pending so admin controls approval
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('আপনার মতামত ও রিভিউ সাবমিট হয়েছে! অ্যাডমিন অনুমোদনের পর প্রদর্শিত হবে।', 'success');
  };

  const approveReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isApproved: true } : r))
    );
    showToast('রিভিউ সফলভাবে অনুমোদন (Approved) করা হয়েছে!', 'success');
  };

  const rejectReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isApproved: false } : r))
    );
    showToast('রিভিউ অপ্রকাশিত (Pending/Unpublished) করা হয়েছে', 'info');
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showToast('রিভিউ ডিলিট করা হয়েছে', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUserProfile,
        updateUserStatus,
        deleteUser,
        changePassword,
        resetPasswordRequest,
        switchUserRole,
        activeTab,
        setActiveTab,
        isAdminMode,
        setIsAdminMode,
        adminActiveTab,
        setAdminActiveTab,
        branding,
        updateBranding,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        services,
        addService,
        updateService,
        deleteService,
        orders,
        createOrder,
        updateOrderStatus,
        requestPaymentProof,
        resubmitPaymentProof,
        submitOrderForm,
        deleteOrder,
        paymentMethods,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        posts,
        addPost,
        updatePost,
        deletePost,
        videoConfig,
        updateVideoConfig,
        reviews,
        addReview,
        approveReview,
        rejectReview,
        deleteReview,
        selectedServiceForPurchase,
        setSelectedServiceForPurchase,
        selectedPostForDetail,
        setSelectedPostForDetail,
        initiatePurchase,
        promptServiceForPurchase,
        setPromptServiceForPurchase,
        isPurchaseAuthPromptOpen,
        setIsPurchaseAuthPromptOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isDarkMode,
        setIsDarkMode,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
