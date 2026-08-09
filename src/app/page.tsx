/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/typedef */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	Search,
	SlidersHorizontal,
	RefreshCw,
	ChevronLeft,
	ChevronRight,
	PackageSearch,
	Sparkles,
} from "lucide-react";
import { Product, Category, ApiMeta } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ApiDocsModal } from "@/components/ApiDocsModal";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { AuthModal } from "@/components/AuthModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { CreateProductModal } from "@/components/CreateProductModal";
import { ManageProductsModal } from "@/components/ManageProductsModal";
import { CategoriesModal } from "@/components/CategoriesModal";
import { UsersModal } from "@/components/UsersModal";
import { AdminDashboard } from "@/components/AdminDashboard";
import { MyListingsModal } from "@/components/MyListingsModal";
import { Toast, useToast } from "@/components/Toast";

export default function HomePage() {
	const { isLoading: authLoading } = useAuth();

	// Modals
	const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [showCreateProduct, setShowCreateProduct] = useState(false);
	const [showMyListings, setShowMyListings] = useState(false);
	const [showManageProducts, setShowManageProducts] = useState(false);
	const [showDashboard, setShowDashboard] = useState(false);
	const [showCategories, setShowCategories] = useState(false);
	const [showUsers, setShowUsers] = useState(false);
	const [showApiDocs, setShowApiDocs] = useState(false);

	// Products state
	const [products, setProducts] = useState<Product[]>([]);
	const [meta, setMeta] = useState<ApiMeta | null>(null);
	const [loadingProducts, setLoadingProducts] = useState(true);

	// Categories for filter
	const [categories, setCategories] = useState<Category[]>([]);

	// Filter state
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [sortBy, setSortBy] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState("desc");
	const [page, setPage] = useState(1);

	const { toast, showToast, hideToast } = useToast();

	// Debounce search
	useEffect(() => {
		const t = setTimeout(() => {
			setDebouncedSearch(search);
			setPage(1);
		}, 400);
		return () => clearTimeout(t);
	}, [search]);

	// Fetch categories once
	useEffect(() => {
		api.categories
			.getAll({ limit: 100 })
			.then((res) => {
				if (res.success)
					setCategories((res.data as unknown as Category[]) ?? []);
			})
			.catch(() => {});
	}, []);

	// Fetch products
	const fetchProducts = useCallback(async () => {
		setLoadingProducts(true);
		try {
			const res = await api.products.getAll({
				page,
				limit: 12,
				search: debouncedSearch || undefined,
				categoryId: categoryId || undefined,
				sortBy,
				sortOrder,
				status: "ACTIVE",
			});
			if (res.success) {
				setProducts((res.data as unknown as Product[]) ?? []);
				setMeta(res.meta ?? null);
			}
		} catch (err: unknown) {
			showToast(
				err instanceof Error ? err.message : "Failed to load products",
				"error"
			);
		} finally {
			setLoadingProducts(false);
		}
	}, [page, debouncedSearch, categoryId, sortBy, sortOrder]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const resetFilters = () => {
		setSearch("");
		setCategoryId("");
		setSortBy("createdAt");
		setSortOrder("desc");
		setPage(1);
	};

	if (authLoading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-slate-950">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse shadow-lg shadow-indigo-500/30">
						<Sparkles className="w-6 h-6 text-white" />
					</div>
					<p className="text-slate-400 text-sm font-medium">
						Loading ShopAPI Platform...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
			{/* Top Navbar */}
			<Navbar
				onCreateProduct={() => setShowCreateProduct(true)}
				onOpenMyListings={() => setShowMyListings(true)}
				onOpenDashboard={() => setShowDashboard(true)}
				onManageCategories={() => setShowCategories(true)}
				onManageUsers={() => setShowUsers(true)}
				onOpenAuth={(mode) => setAuthModal(mode)}
				onOpenApiDocs={() => setShowApiDocs(true)}
			/>

			{/* Hero Section */}
			<HeroSection
				totalProducts={meta?.total ?? products.length}
				totalCategories={categories.length}
				onOpenApiDocs={() => setShowApiDocs(true)}
			/>

			{/* Features Section */}
			<FeaturesSection onOpenApiDocs={() => setShowApiDocs(true)} />

			{/* Product Catalog Section */}
			<section
				id="catalog"
				className="scroll-mt-20 py-16 bg-slate-950">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					{/* Catalog Header */}
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
						<div>
							<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
								Live Inventory
							</div>
							<h2 className="text-3xl font-black text-white tracking-tight">
								Product Catalog & Marketplace
							</h2>
							<p className="text-slate-400 text-sm mt-1">
								Browse, filter, and inspect products powered by REST API.
							</p>
						</div>

						{meta && (
							<span className="text-xs text-slate-400 font-semibold bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl">
								Showing{" "}
								<strong className="text-indigo-400">{products.length}</strong>{" "}
								of <strong className="text-white">{meta.total}</strong> products
							</span>
						)}
					</div>

					{/* Sticky Filter Bar */}
					<div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl shadow-xl mb-8 flex flex-wrap items-center gap-3">
						{/* Search input */}
						<div className="relative flex-1 min-w-55">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search products by title or description..."
								className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
							/>
						</div>

						{/* Category Filter */}
						<select
							value={categoryId}
							onChange={(e) => {
								setCategoryId(e.target.value);
								setPage(1);
							}}
							className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all">
							<option value="">All Categories</option>
							{categories.map((c) => (
								<option
									key={c.id}
									value={c.id}>
									{c.name}
								</option>
							))}
						</select>

						{/* Sort Selector */}
						<div className="flex items-center gap-2">
							<SlidersHorizontal className="w-4 h-4 text-slate-500" />
							<select
								value={`${sortBy}_${sortOrder}`}
								onChange={(e) => {
									const [by, order] = e.target.value.split("_");
									setSortBy(by);
									setSortOrder(order);
									setPage(1);
								}}
								className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
								<option value="createdAt_desc">Newest First</option>
								<option value="createdAt_asc">Oldest First</option>
								<option value="price_asc">Price: Low to High</option>
								<option value="price_desc">Price: High to Low</option>
								<option value="title_asc">Name: A–Z</option>
								<option value="title_desc">Name: Z–A</option>
							</select>
						</div>

						{/* Reset Button */}
						{(search ||
							categoryId ||
							sortBy !== "createdAt" ||
							sortOrder !== "desc") && (
							<button
								onClick={resetFilters}
								className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors">
								<RefreshCw className="w-3.5 h-3.5" />
								Reset Filters
							</button>
						)}
					</div>

					{/* Product Grid */}
					{loadingProducts ?
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className="rounded-2xl bg-slate-900/60 border border-slate-800 h-84 animate-pulse">
									<div className="h-48 bg-slate-800 rounded-t-2xl" />
									<div className="p-5 space-y-3">
										<div className="h-3 bg-slate-800 rounded w-1/3" />
										<div className="h-4 bg-slate-800 rounded w-3/4" />
										<div className="h-3 bg-slate-800 rounded w-full" />
									</div>
								</div>
							))}
						</div>
					: products.length === 0 ?
						<div className="flex flex-col items-center justify-center py-24 gap-4 bg-slate-900/40 rounded-3xl border border-slate-800">
							<div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
								<PackageSearch className="w-10 h-10 text-slate-600" />
							</div>
							<div className="text-center">
								<p className="text-slate-200 font-bold text-lg">
									No products found
								</p>
								<p className="text-slate-500 text-sm mt-1">
									Try adjusting your search terms or category selection.
								</p>
							</div>
							<button
								onClick={resetFilters}
								className="px-5 py-2.5 rounded-xl text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors">
								Reset Search Filters
							</button>
						</div>
					:	<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{products.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									onView={setSelectedProduct}
								/>
							))}
						</div>
					}

					{/* Pagination Controls */}
					{meta && meta.totalPages > 1 && (
						<div className="flex items-center justify-center gap-2 mt-12">
							<button
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
								className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
								<ChevronLeft className="w-4 h-4" />
								Prev
							</button>

							<div className="flex items-center gap-1.5">
								{Array.from(
									{ length: Math.min(meta.totalPages, 7) },
									(_, i) => {
										const p = i + 1;
										return (
											<button
												key={p}
												onClick={() => setPage(p)}
												className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all ${
													page === p ?
														"bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
													:	"text-slate-400 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white"
												}`}>
												{p}
											</button>
										);
									}
								)}
							</div>

							<button
								onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
								disabled={page === meta.totalPages}
								className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
								Next
								<ChevronRight className="w-4 h-4" />
							</button>

							<span className="text-xs text-slate-500 ml-3 font-medium">
								Page {page} of {meta.totalPages}
							</span>
						</div>
					)}
				</div>
			</section>

			{/* Footer Component */}
			<Footer onOpenApiDocs={() => setShowApiDocs(true)} />

			{/* ===== Modals ===== */}
			{authModal && (
				<AuthModal
					mode={authModal}
					onClose={() => setAuthModal(null)}
					onSwitchMode={setAuthModal}
				/>
			)}

			{selectedProduct && (
				<ProductDetailModal
					product={selectedProduct}
					onClose={() => setSelectedProduct(null)}
					onDeleted={(id) => {
						setProducts((prev) => prev.filter((p) => p.id !== id));
						showToast("Product deleted successfully", "success");
					}}
				/>
			)}

			{showCreateProduct && (
				<CreateProductModal
					onClose={() => setShowCreateProduct(false)}
					onCreated={() => {
						fetchProducts();
						showToast("Product created successfully!", "success");
					}}
				/>
			)}

			{showMyListings && (
				<MyListingsModal
					onClose={() => setShowMyListings(false)}
					onAddNew={() => {
						setShowMyListings(false);
						setShowCreateProduct(true);
					}}
					onRefreshCatalog={fetchProducts}
				/>
			)}

			{showManageProducts && (
				<ManageProductsModal
					onClose={() => setShowManageProducts(false)}
					onRefreshCatalog={fetchProducts}
				/>
			)}

			{showDashboard && (
				<AdminDashboard
					onClose={() => setShowDashboard(false)}
					onManageUsers={() => {
						setShowDashboard(false);
						setShowUsers(true);
					}}
					onManageProducts={() => {
						setShowDashboard(false);
						setShowManageProducts(true);
					}}
					onManageCategories={() => {
						setShowDashboard(false);
						setShowCategories(true);
					}}
				/>
			)}

			{showCategories && (
				<CategoriesModal onClose={() => setShowCategories(false)} />
			)}

			{showUsers && <UsersModal onClose={() => setShowUsers(false)} />}

			{showApiDocs && <ApiDocsModal onClose={() => setShowApiDocs(false)} />}

			{toast && (
				<Toast
					message={toast.message}
					type={toast.type}
					onClose={hideToast}
				/>
			)}
		</div>
	);
}
