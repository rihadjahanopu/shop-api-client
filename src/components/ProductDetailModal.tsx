'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, Send, Loader2, Trash2, Package } from 'lucide-react';
import { Product, Review, ApiMeta } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export function ProductDetailModal({ product, onClose, onDeleted }: ProductDetailModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await api.reviews.getAll({ productId: product.id, limit: 20 });
      if (res.success) {
        setReviews((res.data as unknown as Review[]) ?? []);
        setMeta(res.meta ?? null);
      }
    } catch { /* empty */ }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    setReviewError('');
    try {
      await api.reviews.create({ productId: product.id, rating, comment });
      setComment('');
      setRating(5);
      await fetchReviews();
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await api.reviews.delete(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch { /* empty */ }
  };

  const deleteProduct = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(true);
    try {
      await api.products.delete(product.id);
      onDeleted(product.id);
      onClose();
    } catch { /* empty */ } finally {
      setDeleting(false);
    }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const canDelete = user?.role === 'ADMIN' || user?.id === product.sellerId;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 mb-10">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative h-64 rounded-t-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-24 h-24 text-slate-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

          {/* Price overlay */}
          <div className="absolute bottom-4 left-6">
            <span className="text-4xl font-black text-white">${product.price.toFixed(2)}</span>
            <div className="flex items-center gap-2 mt-1">
              {reviews.length > 0 && (
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                  ))}
                  <span className="text-slate-300 text-sm ml-1">{avgRating.toFixed(1)} ({meta?.total ?? reviews.length})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Product info */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {product.category && (
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                    {product.category.name}
                  </span>
                )}
                <h2 className="text-2xl font-black text-white mt-2">{product.title}</h2>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed">{product.description}</p>
              </div>
              {canDelete && (
                <button
                  onClick={deleteProduct}
                  disabled={deleting}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>

            {/* Meta */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Stock</p>
                <p className={`text-lg font-bold mt-0.5 ${product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {product.stock}
                </p>
              </div>
              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</p>
                <p className="text-lg font-bold mt-0.5 text-slate-200">{product.status}</p>
              </div>
              <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-3 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Seller</p>
                <p className="text-sm font-bold mt-0.5 text-slate-200 truncate">{product.seller?.name ?? 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div>
            <h3 className="text-lg font-bold text-slate-100 mb-4">Customer Reviews</h3>

            {/* Submit review */}
            {isAuthenticated ? (
              <form onSubmit={submitReview} className="mb-5 p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                <p className="text-sm font-semibold text-slate-300">Write a review</p>
                {/* Star picker */}
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                    >
                      <Star className={`w-7 h-7 transition-colors cursor-pointer ${s <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600 hover:text-amber-300'}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-slate-400">{rating}/5</span>
                </div>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  required
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition-all"
                />
                {reviewError && (
                  <p className="text-red-400 text-xs font-medium">{reviewError}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="mb-5 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-sm text-indigo-400 text-center">
                Sign in to leave a review
              </div>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-6">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-3">
                {reviews.map(review => (
                  <div key={review.id} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {review.user?.name?.charAt(0).toUpperCase() ?? 'U'}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-200">{review.user?.name ?? 'User'}</span>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      {(user?.role === 'ADMIN' || user?.id === review.userId) && (
                        <button onClick={() => deleteReview(review.id)} className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{review.comment}</p>
                    <p className="text-[11px] text-slate-600 mt-1.5">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
