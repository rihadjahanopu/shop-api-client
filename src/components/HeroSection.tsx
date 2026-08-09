'use client';

import React from 'react';
import {
  ArrowRight,
  Code2,
  Layers,
  TrendingUp,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface HeroSectionProps {
  totalProducts: number;
  totalCategories: number;
  onOpenApiDocs: () => void;
}

export function HeroSection({ totalProducts, totalCategories, onOpenApiDocs }: HeroSectionProps) {
  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden border-b border-white/5 bg-slate-950 pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Dynamic Background Glow & Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wide bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent uppercase">
              Production Ready REST Platform v1.0
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Build & Scale Modern <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              E-Commerce Applications
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
            A complete enterprise RESTful backend and reactive Next.js 16 frontend platform featuring JWT authentication, role-based access control, PostgreSQL & Prisma ORM integration.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={scrollToCatalog}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              Explore Product Catalog
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenApiDocs}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <Code2 className="w-4 h-4 text-purple-400" />
              API Documentation
            </button>
          </div>

          {/* Highlights Checklist */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time CRUD Operations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> JWT Bearer Auth & RBAC
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Type-Safe Prisma Queries
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl pt-8">
            {[
              { label: 'Active Products', value: totalProducts, icon: Layers, color: 'text-indigo-400', bg: 'from-indigo-500/10 to-indigo-500/5' },
              { label: 'Categories', value: totalCategories, icon: TrendingUp, color: 'text-purple-400', bg: 'from-purple-500/10 to-purple-500/5' },
              { label: 'API Uptime', value: '99.9%', icon: Activity, color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/5' },
              { label: 'Avg Latency', value: '< 45ms', icon: Zap, color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-500/5' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className={`p-5 rounded-2xl bg-gradient-to-b ${bg} border border-slate-800/80 backdrop-blur-xl text-left transition-all hover:border-slate-700/80`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live</span>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-white">{value}</p>
                <p className="text-xs text-slate-400 font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
