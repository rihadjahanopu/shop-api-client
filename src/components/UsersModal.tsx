'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Loader2,
  Users,
  Trash2,
  ShieldCheck,
  User as UserIcon,
  AlertTriangle,
  ShieldOff,
} from 'lucide-react';
import { User } from '@/types';
import { api } from '@/lib/api';

// ─── Confirm Modal ──────────────────────────────────────────────────────────

type ConfirmAction = {
  type: 'make-admin' | 'remove-admin' | 'delete';
  user: User;
};

interface ConfirmModalProps {
  action: ConfirmAction;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function ConfirmModal({ action, onConfirm, onCancel, loading }: ConfirmModalProps) {
  const config = {
    'make-admin': {
      icon: ShieldCheck,
      iconClass: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/30',
      title: 'Promote to Admin',
      message: (
        <>
          Promoting <span className="font-bold text-white">{action.user.name}</span> to Admin grants full platform access to manage products, categories, and users.
        </>
      ),
      confirmLabel: 'Promote to Admin',
      confirmClass: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/25',
    },
    'remove-admin': {
      icon: ShieldOff,
      iconClass: 'text-orange-400',
      iconBg: 'bg-orange-500/10 border-orange-500/30',
      title: 'Demote to User',
      message: (
        <>
          Removing Admin access from <span className="font-bold text-white">{action.user.name}</span> will downgrade them to a standard User account.
        </>
      ),
      confirmLabel: 'Demote to User',
      confirmClass: 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/25',
    },
    'delete': {
      icon: AlertTriangle,
      iconClass: 'text-red-400',
      iconBg: 'bg-red-500/10 border-red-500/30',
      title: 'Delete User',
      message: (
        <>
          <span className="font-bold text-white">{action.user.name}</span>
          {' '}(
          <span className="text-slate-400 text-xs">{action.user.email}</span>
          ) will be soft-deleted from the platform.
        </>
      ),
      confirmLabel: 'Yes, Delete User',
      confirmClass: 'bg-red-600 hover:bg-red-500 shadow-red-500/25',
    },
  }[action.type];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-black/60 animate-in fade-in-0 zoom-in-95 duration-150 p-6 flex flex-col gap-5">

        {/* Icon + Title */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
            <Icon className={`w-6 h-6 ${config.iconClass}`} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{config.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Are you sure you want to proceed?</p>
          </div>

          {/* Close X */}
          <button
            onClick={onCancel}
            className="ml-auto p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3">
          {config.message}
        </p>

        {/* User info chip */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {action.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">{action.user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{action.user.email}</p>
          </div>
          <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-0.5 flex-shrink-0 ${
            action.user.role === 'ADMIN'
              ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
              : 'text-sky-400 bg-sky-400/10 border-sky-400/20'
          }`}>
            {action.user.role === 'ADMIN'
              ? <ShieldCheck className="w-2.5 h-2.5" />
              : <UserIcon className="w-2.5 h-2.5" />
            }
            {action.user.role}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${config.confirmClass}`}
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              : config.confirmLabel
            }
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Users Modal ─────────────────────────────────────────────────────────────

interface UsersModalProps { onClose: () => void; }

export function UsersModal({ onClose }: UsersModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Confirm modal state
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.users.getAll({ limit: 50, search: search || undefined });
      if (res.success) setUsers((res.data as unknown as User[]) ?? []);
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setConfirmLoading(true);
    setError('');
    try {
      if (confirmAction.type === 'delete') {
        await api.users.delete(confirmAction.user.id);
        setUsers(prev => prev.filter(u => u.id !== confirmAction.user.id));
      } else {
        const newRole = confirmAction.type === 'make-admin' ? 'ADMIN' : 'USER';
        const res = await api.users.update(confirmAction.user.id, { role: newRole });
        if (res.success) {
          setUsers(prev =>
            prev.map(u =>
              u.id === confirmAction.user.id
                ? { ...u, role: newRole as 'ADMIN' | 'USER' }
                : u
            )
          );
        }
      }
      setConfirmAction(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      setConfirmAction(null);
    } finally {
      setConfirmLoading(false);
    }
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    USER: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  };

  return (
    <>
      {/* Confirm Modal — rendered on top */}
      {confirmAction && (
        <ConfirmModal
          action={confirmAction}
          loading={confirmLoading}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">User Management</h2>
                <p className="text-xs text-slate-500">{users.length} users — Admin role management</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-800">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
          </div>

          {error && (
            <div className="mx-4 mt-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Users list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-10">No users found.</p>
            ) : (
              users.map(user => (
                <div
                  key={user.id}
                  className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 hover:border-slate-700 flex items-center gap-3 transition-all"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5 flex-shrink-0 ${roleColors[user.role]}`}>
                        {user.role === 'ADMIN'
                          ? <ShieldCheck className="w-2.5 h-2.5" />
                          : <UserIcon className="w-2.5 h-2.5" />
                        }
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Joined {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">

                    {/* Role Toggle */}
                    <button
                      onClick={() => setConfirmAction({
                        type: user.role === 'ADMIN' ? 'remove-admin' : 'make-admin',
                        user,
                      })}
                      title={user.role === 'ADMIN' ? 'Remove Admin Access' : 'Promote to Admin'}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                        user.role === 'ADMIN'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-400'
                          : 'bg-slate-700/60 border-slate-600 text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500/40 hover:text-indigo-300'
                      }`}
                    >
                      {user.role === 'ADMIN' ? (
                        <><ShieldOff className="w-3.5 h-3.5" /> Remove Admin</>
                      ) : (
                        <><ShieldCheck className="w-3.5 h-3.5" /> Make Admin</>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setConfirmAction({ type: 'delete', user })}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
