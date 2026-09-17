import React from 'react';
import { X, Calendar, Clock, Eye, Heart, Share2 } from 'lucide-react';
import { Post } from '../../types';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl my-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Thumbnail */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-600">
              {post.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-2 leading-tight">
              {post.title}
            </h2>
          </div>
        </div>

        {/* Meta Bar */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {post.views} ভিউ
            </span>
          </div>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            লেখক: {post.author}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[50vh] overflow-y-auto">
          <p className="text-base font-semibold text-gray-700 dark:text-gray-200 leading-relaxed border-l-4 border-rose-500 pl-4 py-1 italic bg-rose-50/40 dark:bg-rose-950/20 rounded-r">
            {post.excerpt}
          </p>

          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line space-y-4 pt-2">
            {post.content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 hover:text-rose-600 font-medium">
              <Heart className="w-4 h-4 text-rose-500" /> {post.likes} লাইক
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-xs font-semibold"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
