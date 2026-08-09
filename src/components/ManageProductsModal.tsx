'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Loader2,
  Package,
  Trash2,
  Edit2,
  Check,
  Search,
  AlertTriangle,
  Layers,
  Tag,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { api } from '@/lib/api';

interface ManageProductsModalProps {
  onClose: () => void;
  onRefreshCatalog: () => void;
}

export function ManageProductsModal({ onClose, onRefreshCatalog }: ManageProductsModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Edit inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Delete confirm state
  const [deleteProductTarget, setDeleteProductTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch categories
  useEffect(() => {
    api.categories.getAll({ limit: 100 }).then(res => {
      if (res.success) setCategories((res.data as unknown as Category[]) ?? []);
    }).catch(() => {});
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.products.getAll({ limit: 50, search: search || undefined });
      if (res.success) setProducts((res.data as unknown as Product[]) ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Toggle status ACTIVE <-> INACTIVE
  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setSavingId(product.id);
    try {
      const res = await api.products.update(product.id, { status: newStatus });
      if (res.success) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus as 'ACTIVE' | 'INACTIVE' } : p));
        onRefreshCatalog();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setSavingId(null);
    }
  };

  // Start inline editing price & stock
  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditPrice(product.price);
    setEditStock(product.stock);
  };

  // Save inline edit
  const saveEdit = async (product: Product) => {
    setSavingId(product.id);
    try {
      const res = await api.products.update(product.id, { price: editPrice, stock: editStock });
      if (res.success) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, price: editPrice, stock: editStock } : p));
        setEditingId(null);
        onRefreshCatalog();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSavingId(null);
    }
  };

  // Confirm delete product
  const handleDelete = async () => {
    if (!deleteProductTarget) return;
    setDeleting(true);
    try {
      await api.products.delete(deleteProductTarget.id);
      setProducts(prev => prev.filter(p => p.id !== deleteProductTarget.id));
      setDeleteProductTarget(null);
      onRefreshCatalog();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      setDeleteProductTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Custom Delete Confirmation Modal */}
      {deleteProductTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setDeleteProductTarget(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Product</h3>
                <p className="text-xs text-slate-400">Are you sure you want to delete this?</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <p className="font-bold text-white mb-1">{deleteProductTarget.title}</p>
              <p className="text-slate-400">Price: ${deleteProductTarget.price.toFixed(2)} · Stock: {deleteProductTarget.stock}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteProductTarget(null)}
                disabled={deleting}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-all flex items-center justify-center gap-1.5"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {deleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-4xl rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Product Management API</h2>
                <p className="text-xs text-slate-500">{products.length} products loaded — Manage status, price, stock & details</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-slate-800 relative">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products by title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          {error && (
            <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Table Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
            ) : products.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-12">No products found.</p>
            ) : (
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-800">
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.map(p => {
                      const category = categories.find(c => c.id === p.categoryId);
                      const isEditing = editingId === p.id;
                      const isSaving = savingId === p.id;

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          {/* Product Info */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {p.imageUrl ? (
                                  <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-4 h-4 text-slate-500" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-200 truncate max-w-[180px]">{p.title}</p>
                                <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{p.description}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-4 py-3 text-slate-400">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                              <Tag className="w-3 h-3 text-purple-400" />
                              {category?.name || 'Unassigned'}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                value={editPrice}
                                onChange={e => setEditPrice(parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-1 rounded bg-slate-950 border border-indigo-500/50 text-white font-mono text-xs focus:outline-none"
                              />
                            ) : (
                              `$${p.price.toFixed(2)}`
                            )}
                          </td>

                          {/* Stock */}
                          <td className="px-4 py-3 font-mono text-slate-300">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStock}
                                onChange={e => setEditStock(parseInt(e.target.value, 10) || 0)}
                                className="w-16 px-2 py-1 rounded bg-slate-950 border border-indigo-500/50 text-white font-mono text-xs focus:outline-none"
                              />
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${p.stock > 0 ? 'bg-slate-800 text-slate-300' : 'bg-red-500/10 text-red-400'}`}>
                                {p.stock} units
                              </span>
                            )}
                          </td>

                          {/* Status Badge & Toggle */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleStatus(p)}
                              disabled={isSaving}
                              title="Click to toggle status"
                              className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border transition-all ${
                                p.status === 'ACTIVE'
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                                  : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400'
                              }`}
                            >
                              {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : p.status}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {isEditing ? (
                                <button
                                  onClick={() => saveEdit(p)}
                                  disabled={isSaving}
                                  className="p-1.5 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                                  title="Save price & stock"
                                >
                                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                </button>
                              ) : (
                                <button
                                  onClick={() => startEdit(p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                                  title="Edit price & stock"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => setDeleteProductTarget(p)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
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
        </div>
      </div>
    </>
  );
}
