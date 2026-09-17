import React, { useState } from 'react';
import { 
  Palette, Upload, Globe, Image as ImageIcon, 
  CheckCircle2, RefreshCw, Sparkles, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminBranding: React.FC = () => {
  const { branding, updateBranding } = useApp();

  const [name, setName] = useState(branding.name);
  const [tagline, setTagline] = useState(branding.tagline || '');
  const [logo, setLogo] = useState(branding.logo);
  const [favicon, setFavicon] = useState(branding.favicon);
  const [isSaved, setIsSaved] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFavicon(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding({
      name: name.trim() || 'ShebaPoint',
      tagline: tagline.trim(),
      logo: logo.trim(),
      favicon: favicon.trim(),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    setName('ShebaPoint');
    setTagline('ডিজিটাল সেবা ও সোশ্যাল গ্রোথ প্ল্যাটফর্ম');
    setLogo('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80');
    setFavicon('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&auto=format&fit=crop&q=80');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            ওয়েবসাইট ব্র্যান্ডিং সেটিংস
          </h1>
          <span className="text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-2.5 py-0.5 rounded-full">
            Dynamic Settings
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          কোনো কোড পরিবর্তন ছাড়াই আপনার ওয়েবসাইটের নাম, লোগো, ফেভিকন ও ট্যাগলাইন এখান থেকে পরিবর্তন করুন।
        </p>
      </div>

      {isSaved && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>ব্র্যান্ডিং তথ্য সফলভাবে আপডেট করা হয়েছে! সাথে সাথে পুরো ওয়েবসাইটে কার্যকর হয়েছে।</span>
        </div>
      )}

      {/* Live Preview Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700/80 p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            লাইভ প্রিভিউ (Header Live Preview)
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            রিয়েল-টাইম প্রিভিউ
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo Preview"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-rose-500/30 shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="font-extrabold text-base text-gray-900 dark:text-white">
                {name || 'ওয়েবসাইটের নাম'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {tagline || 'ট্যাগলাইন এখানে প্রদর্শিত হবে'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <span className="hidden sm:inline">ব্রাউজার ট্যাব টাইটেল:</span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-gray-800 font-mono text-[11px] text-gray-700 dark:text-gray-300">
              {name} • {tagline ? tagline.slice(0, 20) + '...' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700/80 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Website Name & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              ওয়েবসাইটের নাম (Website Name) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ShebaPoint"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              ট্যাগলাইন / স্লোগান (Tagline)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. ডিজিটাল সেবা ও সোশ্যাল গ্রোথ প্ল্যাটফর্ম"
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Logo Configuration */}
        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700/60">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            ওয়েবসাইট লোগো (Website Logo)
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2 space-y-2">
              <input
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="লোগো ইমেজ লিঙ্ক (https://...)"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">অথবা কম্পিউটার থেকে আপলোড করুন:</span>
                <label className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>ফাইল বেছে নিন</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            </div>

            {/* Logo Preview box */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center">
              <img
                src={logo}
                alt="Logo thumbnail"
                className="max-h-14 max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Favicon Configuration */}
        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700/60">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
            ওয়েবসাইট ফেভিকন (Website Favicon)
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="sm:col-span-2 space-y-2">
              <input
                type="url"
                value={favicon}
                onChange={(e) => setFavicon(e.target.value)}
                placeholder="ফেভিকন আইকন লিঙ্ক (https://...)"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">অথবা আইকন আপলোড করুন:</span>
                <label className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>আইকন ফাইল</span>
                  <input
                    type="file"
                    accept="image/*,.ico"
                    className="hidden"
                    onChange={handleFaviconUpload}
                  />
                </label>
              </div>
            </div>

            {/* Favicon Preview box */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center">
              <img
                src={favicon}
                alt="Favicon thumbnail"
                className="w-8 h-8 object-contain rounded"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-5 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ডিফল্ট রিসেট</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>ব্র্যান্ডিং আপডেট করুন (Save Changes)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
