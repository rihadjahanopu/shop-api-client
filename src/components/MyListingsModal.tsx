'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Package,
  Loader2,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  Plus,
  Tag,
  Star,
  Search,
  TrendingUp,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface MyListingsModalProps {
  onClose: () => void;
  onAddNew: () => void;
  onRefreshCatalog: () => void;
}

export function MyListingsModal({ onClose, onAddNew, onRefreshCatalog }: MyListingsModalProps) {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Inline edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.categories.getAll({ limit: 100 }).then(res => {
      if (res.success) setCategories((res.data as unknown as Category[]) ?? []);
    }).catch(() => {});
  }, []);

  const fetchMyProducts = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.products.getAll({
        sellerId: user.id,
        limit: 50,
        search: search || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      if (res.success) setProducts((res.data as unknown as Product[]) ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load your products');
    } finally {
      setLoading(false);
    }
  }, [user?.id, search]);

  useEffect(() => {
    const t = setTimeout(() => fetchMyProducts(), 300);
    return () => clearTimeout(t);
  }, [fetchMyProducts]);

  const toggleStatus = async (p: Product) => {
    const newStatus = p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setSavingId(p.id);
    try {
      const res = await api.products.update(p.id, { status: newStatus });
      if (res.success) {
        setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus as 'ACTIVE' | 'INACTIVE' } : x));
        onRefreshCatalog();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setSavingId(null);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditPrice(p.price);
    setEditStock(p.stock);
  };

  const saveEdit = async (p: Product) => {
    setSavingId(p.id);
    try {
      const res = await api.products.update(p.id, { price: editPrice, stock: editStock });
      if (res.success) {
        setProducts(prev => prev.map(x => x.id === p.id ? { ...x, price: editPrice, stock: editStock } : x));
        setEditingId(null);
        onRefreshCatalog();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.products.delete(deleteTarget.id);
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      onRefreshCatalog();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const activeCount = products.filter(p => p.status === 'ACTIVE').length;

  return (
    <>
      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Listing</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <p className="font-bold text-white mb-1">{deleteTarget.title}</p>
              <p className="text-slate-400">${deleteTarget.price.toFixed(2)} · {deleteTarget.stock} in stock</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-all flex items-center justify-center gap-1.5">
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">My Listings</h2>
                <p className="text-xs text-slate-500">Manage the products you've listed</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onAddNew}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> New Listing
              </button>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-slate-800 bg-slate-950/30">
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-slate-400"><span className="font-bold text-white">{products.length}</span> total</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-slate-400"><span className="font-bold text-emerald-400">{activeCount}</span> active</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-400">Inventory value: <span className="font-bold text-amber-400">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></span>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-800 relative">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your listings..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          {error && (
            <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Package className="w-7 h-7 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300">No listings yet</p>
                  <p className="text-xs text-slate-500 mt-0.5">Start by adding your first product</p>
                </div>
                <button
                  onClick={onAddNew}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Product
                </button>
              </div>
            ) : (
              products.map(p => {
                const category = categories.find(c => c.id === p.categoryId);
                const isEditing = editingId === p.id;
                const isSaving = savingId === p.id;

                return (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition-all">
                    {/* Image */}
                    <div className="w-12 h-12 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                        : <Package className="w-5 h-5 text-slate-500" />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {category && (
                          <span className="flex items-center gap-0.5 text-[10px] text-purple-400">
                            <Tag className="w-2.5 h-2.5" />{category.name}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-600">
                          {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0 w-24">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editPrice}
                          onChange={e => setEditPrice(parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-indigo-500/50 text-white font-mono text-xs focus:outline-none text-right"
                        />
                      ) : (
                        <p className="text-sm font-bold text-emerald-400">${p.price.toFixed(2)}</p>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="flex-shrink-0 w-20 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={e => setEditStock(parseInt(e.target.value, 10) || 0)}
                          className="w-full px-2 py-1 rounded bg-slate-950 border border-indigo-500/50 text-white font-mono text-xs focus:outline-none text-center"
                        />
                      ) : (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${p.stock > 0 ? 'bg-slate-800 text-slate-300' : 'bg-red-500/10 text-red-400'}`}>
                          {p.stock} units
                        </span>
                      )}
                    </div>

                    {/* Status toggle */}
                    <button
                      onClick={() => toggleStatus(p)}
                      disabled={isSaving}
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border transition-all flex-shrink-0 ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                          : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400'
                      }`}
                    >
                      {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : p.status}
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isEditing ? (
                        <button
                          onClick={() => saveEdit(p)}
                          disabled={isSaving}
                          className="p-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                          title="Save"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-700 transition-colors"
                          title="Edit price & stock"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
