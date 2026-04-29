'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartPulse, Utensils, Pill, Coffee, 
  MessageCircle, Heart, Trash2, Send, 
  Compass, PlusCircle, Sparkles, Smile, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const categories = [
  { name: "All", icon: <Compass size={18} />, color: "bg-teal-500" },
  { name: "General", icon: <MessageCircle size={18} />, color: "bg-blue-500" },
  { name: "Hospitals", icon: <HeartPulse size={18} />, color: "bg-rose-500" },
  { name: "Canteens", icon: <Utensils size={18} />, color: "bg-orange-500" },
  { name: "Pharmacy", icon: <Pill size={18} />, color: "bg-purple-500" },
  { name: "Cafes", icon: <Coffee size={18} />, color: "bg-amber-600" },
  { name: "Study Spots", icon: <Coffee size={18} />, color: "bg-indigo-500" },
];

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const popIn = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', bounce: 0.4, duration: 0.6 } }
};

// Generate or get guest ID for liking
const getGuestId = () => {
  if (typeof window !== 'undefined') {
    let id = localStorage.getItem('nest_guest_id');
    if (!id) {
      id = 'guest_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('nest_guest_id', id);
    }
    return id;
  }
  return null;
};

export default function GuidePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Create Post state
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General', guestName: '' });
  const [submitting, setSubmitting] = useState(false);

  // Comment state
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentGuestName, setCommentGuestName] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = activeCategory === 'All' ? '/guides' : `/guides?category=${activeCategory}`;
      const res = await api.get(url);
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user && !newPost.guestName.trim()) {
      return alert('Please enter your name to post.');
    }
    setSubmitting(true);
    try {
      await api.post('/guides', newPost);
      setShowCreate(false);
      setNewPost({ title: '', content: '', category: 'General', guestName: '' });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/guides/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleToggleLike = async (id) => {
    try {
      const likerId = user ? user._id : getGuestId();
      
      // Optimistic update
      const postIndex = posts.findIndex(p => p._id === id);
      const post = posts[postIndex];
      const isLiked = post.likes.includes(likerId);
      const newLikes = isLiked ? post.likes.filter(uid => uid !== likerId) : [...post.likes, likerId];
      setPosts(posts.map(p => p._id === id ? { ...p, likes: newLikes } : p));

      // Actual API call
      const res = await api.put(`/guides/${id}/like`, { guestId: !user ? likerId : undefined });
      setPosts(current => current.map(p => p._id === id ? { ...p, likes: res.data.likes } : p));
    } catch (err) {
      console.error('Failed to like', err);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!user && !commentGuestName.trim()) return alert('Please enter your name to comment.');
    if (!commentText.trim()) return;
    
    setCommenting(true);
    try {
      const payload = { text: commentText };
      if (!user) payload.guestName = commentGuestName;

      const res = await api.post(`/guides/${postId}/comments`, payload);
      setPosts(posts.map(p => p._id === postId ? { ...p, comments: res.data.comments } : p));
      setCommentText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-amber-50/30 pt-28 pb-20 px-4 md:px-8 relative overflow-hidden">
      
      {/* Playful Background Blobs */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, 30, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-[-10%] w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-[100px] -z-10 pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-[-10%] w-[400px] h-[400px] bg-amber-200/40 rounded-full blur-[100px] -z-10 pointer-events-none"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-rose-400 to-orange-400 p-4 rounded-3xl shadow-lg rotate-3">
              <Smile size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Campus Guide</h1>
              <p className="text-slate-500 font-bold mt-1">Share secrets. Ask questions. Help out.</p>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreate(!showCreate)}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 transition-all flex items-center gap-2"
          >
            <PlusCircle size={20} /> {showCreate ? 'Close Form' : 'Write a Post'}
          </motion.button>
        </motion.div>

        {/* Categories / Filters (Horizontal Scroll) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex overflow-x-auto gap-3 pb-6 mb-4 hide-scrollbar snap-x"
        >
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.name)}
              className={`snap-center shrink-0 flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                activeCategory === cat.name 
                  ? `${cat.color} text-white shadow-lg scale-105` 
                  : 'bg-white text-slate-600 shadow-sm border border-slate-100 hover:border-slate-300'
              }`}
            >
              <span className={activeCategory === cat.name ? 'text-white' : cat.color.replace('bg-', 'text-')}>{cat.icon}</span>
              {cat.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Create Post Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div 
              initial={{ opacity: 0, height: 0, scale: 0.9 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="overflow-hidden mb-10"
            >
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Sparkles size={80} />
                </div>
                <h3 className="font-black text-2xl text-slate-800 mb-6 flex items-center gap-2">
                  What's on your mind? ✨
                </h3>
                <form onSubmit={handleCreatePost}>
                  
                  {!user && (
                    <div className="mb-4">
                      <input 
                        type="text" required placeholder="Your Name"
                        value={newPost.guestName} onChange={e => setNewPost({...newPost, guestName: e.target.value})}
                        className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-teal-400 focus:bg-white transition-all"
                      />
                    </div>
                  )}

                  <input 
                    type="text" required placeholder="Give it a catchy title..."
                    value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg outline-none focus:border-teal-400 focus:bg-white transition-all mb-4"
                  />
                  <textarea 
                    required rows={4} placeholder="Write your tips, review, or question here..."
                    value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium outline-none focus:border-teal-400 focus:bg-white transition-all mb-6 resize-none"
                  />
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-full sm:w-auto flex items-center gap-3 bg-slate-50 p-2 border-2 border-slate-100 rounded-2xl">
                      <span className="pl-3 font-bold text-slate-500 text-sm">Tag:</span>
                      <select 
                        value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})}
                        className="p-2 bg-transparent font-black text-teal-600 outline-none cursor-pointer"
                      >
                        {categories.filter(c => c.name !== 'All').map(c => (
                          <option key={c.name} value={c.name} className="font-bold">{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit" disabled={submitting}
                      className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? 'Posting...' : <><Send size={18}/> Publish Post</>}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Feed */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 animate-pulse">
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-32"></div>
                    <div className="h-3 bg-slate-100 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-slate-100 rounded w-full mb-4"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200"
          >
            <div className="text-7xl mb-6 inline-block animate-bounce">📭</div>
            <h3 className="text-3xl font-black text-slate-700 mb-2">It's quiet here...</h3>
            <p className="text-slate-500 font-bold text-lg">Be the first to share something about {activeCategory}!</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-6 md:space-y-8"
          >
            <AnimatePresence>
              {posts.map((post) => {
                const likerId = user ? user._id : getGuestId();
                const isLiked = post.likes.includes(likerId);
                const isAuthor = user && post.author && user._id === post.author._id;
                
                const authorName = post.author ? post.author.name : post.guestName;
                const authorInitial = authorName ? authorName.charAt(0).toUpperCase() : '?';

                return (
                  <motion.div 
                    key={post._id}
                    layout
                    variants={popIn}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    whileHover={{ y: -4 }}
                    className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40"
                  >
                    {/* Post Header */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md ${
                          categories.find(c => c.name === post.category)?.color || 'bg-slate-400'
                        }`}>
                          {authorInitial}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-lg flex items-center gap-2">
                            {authorName}
                            {post.author?.role === 'landlord' && (
                              <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-1 rounded-lg uppercase tracking-widest font-black">Landlord</span>
                            )}
                            {!post.author && (
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase tracking-widest font-black">Guest</span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400 font-bold mt-0.5">
                            {formatDate(post.createdAt)} • <span className="text-slate-600">{post.category}</span>
                          </p>
                        </div>
                      </div>
                      {isAuthor && (
                        <motion.button 
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeletePost(post._id)} 
                          className="bg-slate-50 p-3 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      )}
                    </div>

                    {/* Post Content */}
                    <h2 className="text-2xl font-black text-slate-900 mb-3 leading-tight">{post.title}</h2>
                    <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap mb-8 text-lg">
                      {post.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-5 border-t-2 border-slate-50">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handleToggleLike(post._id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black transition-all ${
                          isLiked 
                            ? 'bg-rose-50 text-rose-500 border border-rose-100' 
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
                        }`}
                      >
                        <Heart size={18} className={isLiked ? "fill-current" : ""} /> {post.likes.length}
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post._id ? null : post._id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black transition-all ${
                          activeCommentPostId === post._id
                            ? 'bg-teal-50 text-teal-600 border border-teal-100'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
                        }`}
                      >
                        <MessageCircle size={18} className={activeCommentPostId === post._id ? "fill-current" : ""} /> {post.comments.length}
                      </motion.button>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {activeCommentPostId === post._id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-6 bg-slate-50/80 rounded-3xl p-5 md:p-6 border border-slate-100"
                        >
                          {post.comments.length > 0 ? (
                            <div className="space-y-5 mb-6">
                              {post.comments.map((comment, idx) => {
                                const cAuthorName = comment.author ? comment.author.name : comment.guestName;
                                const cAuthorInitial = cAuthorName ? cAuthorName.charAt(0).toUpperCase() : '?';
                                return (
                                  <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={comment._id} 
                                    className="flex gap-4"
                                  >
                                    <div className="w-10 h-10 bg-white shadow-sm text-slate-600 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border border-slate-100">
                                      {cAuthorInitial}
                                    </div>
                                    <div className="flex-1 bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm">
                                      <div className="flex items-baseline gap-2 mb-1.5">
                                        <span className="font-black text-slate-800 text-sm">{cAuthorName}</span>
                                        {!comment.author && <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">Guest</span>}
                                        <span className="text-[10px] font-bold text-slate-400">{formatDate(comment.createdAt)}</span>
                                      </div>
                                      <p className="text-slate-600 font-medium text-sm leading-relaxed">{comment.text}</p>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-6 mb-4">
                              <span className="text-3xl">💭</span>
                              <p className="text-sm text-slate-400 font-bold mt-2">No comments yet. Be the first!</p>
                            </div>
                          )}
                          
                          <form onSubmit={(e) => handleAddComment(e, post._id)} className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t-2 border-slate-100">
                            {!user && (
                              <input 
                                type="text" placeholder="Your Name" required
                                value={commentGuestName} onChange={e => setCommentGuestName(e.target.value)}
                                className="sm:w-32 px-5 py-3.5 rounded-full text-sm font-semibold bg-white border-2 border-slate-100 outline-none focus:border-teal-400 transition"
                              />
                            )}
                            <div className="flex-1 flex gap-2">
                              <input 
                                type="text" placeholder="Write a sweet comment..." required
                                value={commentText} onChange={e => setCommentText(e.target.value)}
                                className="flex-1 px-5 py-3.5 rounded-full text-sm font-semibold bg-white border-2 border-slate-100 outline-none focus:border-teal-400 transition"
                              />
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                type="submit" disabled={commenting} 
                                className="bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 disabled:opacity-50"
                              >
                                <Send size={18} className="-ml-1" />
                              </motion.button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}