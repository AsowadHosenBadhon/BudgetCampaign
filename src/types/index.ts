export type UserRole = 'user' | 'admin';

export type UserStatus = 'active' | 'deactivated' | 'suspended' | 'banned';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  joinedDate: string;
  bio?: string;
  password?: string;
}

export type OrderStatus = 'pending' | 'approved' | 'processing' | 'running' | 'completed' | 'rejected';

export interface FormField {
  id: string;
  label: string;
  labelBn?: string;
  placeholder?: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'file' | 'url';
  options?: string[]; // for dropdown select
  required: boolean;
  helpText?: string;
  description?: string;
}

export type CustomFormField = FormField;

export interface FormSubmission {
  submittedAt: string;
  values?: Record<string, any>;
  data?: Record<string, any>;
  isReviewed?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  paidAmount: number;
  paymentMethod: string; // e.g. 'bKash', 'Nagad', 'Rocket'
  senderNumber: string;
  transactionId: string;
  screenshotUrl?: string;
  notes?: string;
  status: OrderStatus;
  statusNote?: string;
  paymentProofRequested?: boolean; // When admin requests user to re-submit payment proof / transaction ID
  paymentProofRequestNote?: string; // Specific message from admin explaining what was wrong with previous payment proof
  formSubmission?: FormSubmission; // User's submitted custom form during Processing stage
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  nameBn?: string;
  category: string;
  categoryBn?: string;
  categoryId?: string;
  description: string;
  descriptionBn?: string;
  features?: string[];
  price: number;
  originalPrice?: number;
  duration?: string; // e.g. "3-5 Days"
  deliveryTime?: string;
  icon?: string;
  image?: string; // primary image
  images?: string[]; // single or multiple images
  badge?: string;
  isActive: boolean;
  status?: 'active' | 'inactive';
  isPopular?: boolean; // Admin can toggle for Popular Package section
  isRecommended?: boolean; // Admin can toggle for Recommended Package section
  customFields?: FormField[]; // Admin defined form fields for this service
}

export interface Category {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export interface WebsiteBranding {
  name: string;
  logo: string;
  favicon: string;
  tagline?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'Personal' | 'Merchant' | 'Agent';
  number: string;
  logo: string;
  instructions: string;
  isActive: boolean;
  color: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  type: 'popular' | 'recommended';
  author: string;
  date: string;
  readTime: string;
  views: number;
  likes: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  orderId?: string; // Associated completed order ID
  serviceId?: string;
  serviceName: string;
  rating: number; // 1 - 5
  comment: string;
  date: string;
  isApproved: boolean;
}

export interface VideoConfig {
  youtubeUrl: string;
  title: string;
  subtitle: string;
  thumbnail: string;
}
