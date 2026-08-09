'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  PlusCircle,
  FolderTree,
  Users,
  User as UserIcon,
  X,
  Menu,
  Code2,
  Layers,
  Zap,
  LayoutDashboard,
  List,
} from 'lucide-react';

interface NavbarProps {
  onCreateProduct: () => void;
  onOpenMyListings: () => void;
  onOpenDashboard?: () => void;
  onManageCategories: () => void;
  onManageUsers: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenApiDocs: () => void;
}

export function Navbar({
  onCreateProduct,
  onOpenMyListings,
  onOpenDashboard,
  onManageCategories,
  onManageUsers,
  onOpenAuth,
  onOpenApiDocs,
}: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4 py-3">

        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                ShopAPI
              </span>
              <p className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase -mt-0.5">
                REST Ecosystem
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 border-l border-slate-800/80 pl-6">
            <button
              onClick={() => scrollToSection('hero')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" /> Home
            </button>
            <button
              onClick={() => scrollToSection('catalog')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Catalog
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Features
            </button>
            <button
              onClick={onOpenApiDocs}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" /> API Docs
            </button>
          </nav>
        </div>

        {/* Right Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <>
                  <button
                    onClick={onCreateProduct}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Product
                  </button>

                  <button
                    onClick={onOpenMyListings}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                  >
                    <List className="w-3.5 h-3.5 text-sky-400" />
                    My Listings
                  </button>

                  {onOpenDashboard && (
                    <button
                      onClick={onOpenDashboard}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-500/20"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </button>
                  )}
                </>
              )}

              {/* Profile Bar */}
              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    user?.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden xl:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
                    {user?.role === 'ADMIN' && (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-md">
                        <ShieldCheck className="w-2.5 h-2.5" /> ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-1 p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 py-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1 pb-3 border-b border-slate-800">
            <button
              onClick={() => scrollToSection('hero')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 flex items-center gap-2 text-left"
            >
              <Zap className="w-4 h-4 text-indigo-400" /> Home Overview
            </button>
            <button
              onClick={() => scrollToSection('catalog')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 flex items-center gap-2 text-left"
            >
              <Layers className="w-4 h-4 text-indigo-400" /> Product Catalog
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 flex items-center gap-2 text-left"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Platform Features
            </button>
            <button
              onClick={() => { setMenuOpen(false); onOpenApiDocs(); }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 flex items-center gap-2 text-left"
            >
              <Code2 className="w-4 h-4 text-indigo-400" /> API Docs Reference
            </button>
          </div>

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 py-2 border-b border-slate-800">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email} · {user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => { onCreateProduct(); setMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                <PlusCircle className="w-4 h-4" /> Add Product
              </button>
              {user?.role === 'ADMIN' && (
                <>
                  <button
                    onClick={() => { onManageCategories(); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800"
                  >
                    <FolderTree className="w-4 h-4 text-purple-400" /> Categories
                  </button>
                  <button
                    onClick={() => { onManageUsers(); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800"
                  >
                    <Users className="w-4 h-4 text-amber-400" /> Users
                  </button>
                </>
              )}
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => { onOpenAuth('login'); setMenuOpen(false); }}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
              <button
                onClick={() => { onOpenAuth('register'); setMenuOpen(false); }}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600"
              >
                <UserPlus className="w-4 h-4" /> Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
