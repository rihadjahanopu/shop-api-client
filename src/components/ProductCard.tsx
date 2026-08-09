'use client';

import React from 'react';
import { ShoppingCart, Star, Package, Eye } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
}

export function ProductCard({ product, onView }: ProductCardProps) {
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

  const statusColor: Record<string, string> = {
    ACTIVE: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    INACTIVE: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    ARCHIVED: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  };

  return (
    <div className="group relative rounded-2xl border border-white/5 bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/20 flex flex-col">

      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-slate-700" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor[product.status] || statusColor.ACTIVE}`}>
            {product.status}
          </span>
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${product.stock > 10 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : product.stock > 0 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* View button */}
        <button
          onClick={() => onView(product)}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur text-white text-xs font-semibold border border-white/20 hover:bg-white/20"
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 gap-3">
        {/* Category */}
        {product.category && (
          <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md w-fit border border-indigo-500/20">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors leading-snug line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        {(product._count?.reviews ?? 0) > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {avgRating.toFixed(1)} ({product._count?.reviews})
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-xl font-extrabold text-white">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onView(product)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:text-indigo-200 transition-all active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
