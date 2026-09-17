import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Video, FileText, Check, 
  X, Eye, Flame, Bookmark, Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Post } from '../../types';
import { ConfirmDeleteModal } from '../common/ConfirmDeleteModal';

export const AdminPosts: React.FC = () => {
  const { 
    posts, 
    addPost, 
    updatePost, 
    deletePost, 
    videoConfig, 
    updateVideoConfig, 
    showToast 
  } = useApp();

  // Video Config state
  const [videoUrl, setVideoUrl] = useState(videoConfig.youtubeUrl);
  const [videoTitle, setVideoTitle] = useState(videoConfig.title);
  const [videoSubtitle, setVideoSubtitle] = useState(videoConfig.subtitle);
  const [videoThumbnail, setVideoThumbnail] = useState(videoConfig.thumbnail);

  // Post modal states
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('Digital Marketing');
  const [type, setType] = useState<'popular' | 'recommended'>('popular');
  const [readTime, setReadTime] = useState('৪ মিনিট');

  const handleSaveVideoConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateVideoConfig({
      youtubeUrl: videoUrl.trim(),
      title: videoTitle.trim(),
      subtitle: videoSubtitle.trim(),
      thumbnail: videoThumbnail.trim(),
    });
  };

  const handleOpenAddPost = () => {
    setEditingPost(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setThumbnail('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80');
    setCategory('Digital Marketing');
    setType('popular');
    setReadTime('৪ মিনিট');
    setIsPostModalOpen(true);
  };

  const handleOpenEditPost = (p: Post) => {
    setEditingPost(p);
    setTitle(p.title);
    setExcerpt(p.excerpt);
    setContent(p.content);
    setThumbnail(p.thumbnail);
    setCategory(p.category);
    setType(p.type);
    setReadTime(p.readTime);
    setIsPostModalOpen(true);
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('পোস্টের শিরোনাম ও বিবরণ লিখুন!', 'error');
      return;
    }

    if (editingPost) {
      updatePost(editingPost.id, {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        thumbnail: thumbnail.trim(),
        category: category.trim(),
        type,
        readTime: readTime.trim(),
      });
    } else {
      addPost({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        thumbnail: thumbnail.trim(),
        category: category.trim(),
        type,
        author: 'Admin',
        date: new Date().toISOString().split('T')[0],
        readTime: readTime.trim(),
      });
    }

    setIsPostModalOpen(false);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Featured YouTube Video Section Management */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              হোমপেজ Featured YouTube Video সেটিংস
            </h3>
            <p className="text-xs text-gray-500">
              হোমপেজের শীর্ষে প্রদর্শিত প্রধান ভিডিওর টাইটেল, লিংক ও থাম্বনেইল পরিবর্তন করুন।
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveVideoConfig} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                YouTube Video URL (Watch বা Embed লিংক)
              </label>
              <input
                type="text"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                ভিডিও থাম্বনেইল ইমেজ URL
              </label>
              <input
                type="text"
                value={videoThumbnail}
                onChange={(e) => setVideoThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                ভিডিও প্রধান শিরোনাম (Title)
              </label>
              <input
                type="text"
                required
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                উপ-শিরোনাম (Subtitle / Tagline)
              </label>
              <input
                type="text"
                value={videoSubtitle}
                onChange={(e) => setVideoSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
            >
              ভিডিও সেটিংস সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>

      {/* 2. Popular & Recommended Posts Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              হোমপেজ পোস্ট ম্যানেজমেন্ট (Popular & Recommended Posts)
            </h3>
            <p className="text-xs text-gray-500">
              হোমপেজে প্রদর্শনের জন্য নতুন আর্টিকেল বা টিপস যোগ করুন ও এডিট করুন।
            </p>
          </div>

          <button
            onClick={handleOpenAddPost}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পোস্ট লিখুন</span>
          </button>
        </div>

        {/* Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 uppercase text-[10px] border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4">থাম্বনেইল ও শিরোনাম</th>
                  <th className="py-3 px-4">ক্যাটাগরি</th>
                  <th className="py-3 px-4">সেকশন টাইপ</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="w-12 h-10 object-cover rounded-lg shrink-0"
                        />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white max-w-sm line-clamp-1">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-gray-400 line-clamp-1 max-w-sm">
                            {p.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.type === 'popular'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {p.type === 'popular' ? 'Popular Post' : 'Recommended'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                      {p.date}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditPost(p)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="এডিট"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-post-btn-${p.id}`}
                          onClick={() => setPostToDelete(p)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="পোস্ট মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div 
            className="w-full max-w-xl my-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {editingPost ? 'পোস্ট এডিট করুন' : 'নতুন পোস্ট তৈরি করুন'}
              </h3>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  পোস্টের শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    হোমপেজ সেকশন (Section Type)
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="popular">Popular Posts</option>
                    <option value="recommended">Recommended Posts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    পড়ার সময় (Read Time)
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  থাম্বনেইল ছবি URL
                </label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  সংক্ষিপ্ত সারাংশ (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  মূল কন্টেন্ট (Full Content) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow"
                >
                  পোস্ট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Post Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => {
          if (postToDelete) {
            deletePost(postToDelete.id);
            setPostToDelete(null);
          }
        }}
        title="পোস্ট মুছে ফেলুন"
        itemName={postToDelete?.title}
        description={`আপনি কি নিশ্চিতভাবে "${postToDelete?.title || ''}" পোস্টটি মুছে ফেলতে চান? ব্যবহারকারীরা হোম পেজ থেকে আর এটি পড়তে পারবেন না।`}
        confirmText="হ্যাঁ, পোস্ট মুছুন"
        cancelText="বাতিল"
        idPrefix="post-delete"
      />

    </div>
  );
};
