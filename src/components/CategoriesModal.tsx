'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Pencil, Trash2, Loader2, FolderTree, Check } from 'lucide-react';
import { Category } from '@/types';
import { api } from '@/lib/api';

interface CategoriesModalProps { onClose: () => void; }

export function CategoriesModal({ onClose }: CategoriesModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.categories.getAll({ limit: 100 });
      if (res.success) setCategories((res.data as unknown as Category[]) ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const createCategory = async () => {
    if (!newName.trim()) return;
    setSaving(true); setError('');
    try {
      await api.categories.create({ name: newName.trim(), description: newDesc.trim() || undefined });
      setNewName(''); setNewDesc('');
      await fetchCategories();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally { setSaving(false); }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true); setError('');
    try {
      await api.categories.update(editing.id, { name: editing.name, description: editing.description ?? undefined });
      setEditing(null);
      await fetchCategories();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally { setSaving(false); }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.categories.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <FolderTree className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Manage Categories</h2>
              <p className="text-xs text-slate-500">{categories.length} categories total</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add new */}
        <div className="p-6 pb-4 border-b border-slate-800 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Add New Category</p>
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Category name..."
            onKeyDown={e => e.key === 'Enter' && createCategory()}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          />
          <input
            type="text"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={createCategory}
            disabled={saving || !newName.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Category
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-10">No categories yet.</p>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center gap-3">
                {editing?.id === cat.id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editing.name}
                      onChange={e => setEditing({ ...editing, name: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <input
                      type="text"
                      value={editing.description ?? ''}
                      onChange={e => setEditing({ ...editing, description: e.target.value })}
                      placeholder="Description..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} disabled={saving} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button onClick={() => setEditing(null)} className="px-2 py-1 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">{cat.name}</p>
                      {cat.description && <p className="text-xs text-slate-500 truncate">{cat.description}</p>}
                      <p className="text-xs text-slate-600 mt-0.5">{cat._count?.products ?? 0} products</p>
                    </div>
                    <button onClick={() => setEditing(cat)} className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
