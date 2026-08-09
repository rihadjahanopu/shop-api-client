/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Category, Product, Review, User } from "@/types";
import {
	Activity,
	AlertCircle,
	ArrowDownRight,
	ArrowUpRight,
	BarChart2,
	DollarSign,
	Layers,
	Loader2,
	Package,
	RefreshCw,
	ShieldCheck,
	ShieldOff,
	Star,
	Tag,
	TrendingUp,
	UserCheck,
	Users,
	X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

interface AdminDashboardProps {
	onClose: () => void;
	onManageUsers: () => void;
	onManageProducts: () => void;
	onManageCategories: () => void;
}

interface Stats {
	totalUsers: number;
	adminUsers: number;
	totalProducts: number;
	activeProducts: number;
	totalCategories: number;
	totalRevenue: number;
	avgPrice: number;
}

function StatCard({
	icon: Icon,
	label,
	value,
	sub,
	color,
	change,
}: {
	icon: React.ElementType;
	label: string;
	value: string | number;
	sub?: string;
	color: string;
	change?: { value: string; up: boolean };
}) {
	return (
		<div
			className={`relative rounded-2xl border p-4 flex flex-col gap-3 overflow-hidden ${color}`}>
			<div className="flex items-start justify-between">
				<div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10">
					<Icon className="w-5 h-5" />
				</div>
				{change && (
					<span
						className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${change.up ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
						{change.up ?
							<ArrowUpRight className="w-3 h-3" />
						:	<ArrowDownRight className="w-3 h-3" />}
						{change.value}
					</span>
				)}
			</div>
			<div>
				<p className="text-2xl font-black text-white">{value}</p>
				<p className="text-xs font-semibold text-slate-300 mt-0.5">{label}</p>
				{sub && <p className="text-[11px] text-slate-500 mt-1">{sub}</p>}
			</div>
			{/* subtle glow bg */}
			<div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 blur-2xl bg-white" />
		</div>
	);
}

function MiniBar({
	label,
	value,
	max,
	color,
}: {
	label: string;
	value: number;
	max: number;
	color: string;
}) {
	const pct = max > 0 ? Math.round((value / max) * 100) : 0;
	return (
		<div className="flex items-center gap-3">
			<p className="text-xs text-slate-400 w-28 truncate shrink-0">{label}</p>
			<div className="flex-1 h-2 rounded-full bg-slate-800">
				<div
					className={`h-2 rounded-full transition-all duration-700 ${color}`}
					style={{ width: `${pct}%` }}
				/>
			</div>
			<p className="text-xs font-bold text-slate-300 w-8 text-right">{value}</p>
		</div>
	);
}

export function AdminDashboard({
	onClose,
	onManageUsers,
	onManageProducts,
	onManageCategories,
}: AdminDashboardProps) {
	const { user } = useAuth();
	const isAdmin = user?.role === "ADMIN";

	const [stats, setStats] = useState<Stats | null>(null);
	const [recentUsers, setRecentUsers] = useState<User[]>([]);
	const [recentProducts, setRecentProducts] = useState<Product[]>([]);
	const [topCategories, setTopCategories] = useState<Category[]>([]);
	const [recentReviews, setRecentReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState("");

	const fetchAll = useCallback(
		async (silent = false) => {
			if (!isAdmin) return;
			if (!silent) setLoading(true);
			else setRefreshing(true);
			setError("");

			try {
				const [usersRes, productsRes, catsRes, reviewsRes] = await Promise.all([
					api.users.getAll({ limit: 50 }),
					api.products.getAll({
						limit: 50,
						sortBy: "createdAt",
						sortOrder: "desc",
					}),
					api.categories.getAll({ limit: 20 }),
					api.reviews.getAll({ limit: 5 }),
				]);

				const users = (usersRes.data as unknown as User[]) ?? [];
				const products = (productsRes.data as unknown as Product[]) ?? [];
				const categories = (catsRes.data as unknown as Category[]) ?? [];
				const reviews = (reviewsRes.data as unknown as Review[]) ?? [];

				const activeProducts = products.filter((p) => p.status === "ACTIVE");
				const totalRevenue = products.reduce(
					(sum, p) => sum + p.price * p.stock,
					0
				);
				const avgPrice =
					products.length > 0 ?
						products.reduce((s, p) => s + p.price, 0) / products.length
					:	0;

				setStats({
					totalUsers: usersRes.meta?.total ?? users.length,
					adminUsers: users.filter((u) => u.role === "ADMIN").length,
					totalProducts: productsRes.meta?.total ?? products.length,
					activeProducts: activeProducts.length,
					totalCategories: catsRes.meta?.total ?? categories.length,
					totalRevenue,
					avgPrice,
				});

				setRecentUsers(users.slice(0, 5));
				setRecentProducts(products.slice(0, 5));
				setTopCategories(categories);
				setRecentReviews(reviews);
			} catch (err: unknown) {
				setError(
					err instanceof Error ? err.message : "Failed to load dashboard data"
				);
			} finally {
				setLoading(false);
				setRefreshing(false);
			}
		},
		[isAdmin]
	);

	// ── Always call hooks before any early return (React Rules of Hooks) ─────────
	useEffect(() => {
		fetchAll();
	}, [fetchAll]);

	// ── Role Guard: only ADMIN may view this dashboard ───────────────────────────
	if (!isAdmin) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div
					className="absolute inset-0 bg-black/80 backdrop-blur-xl"
					onClick={onClose}
				/>
				<div className="relative w-full max-w-sm rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl p-8 flex flex-col items-center gap-4 text-center">
					<div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
						<ShieldOff className="w-8 h-8 text-red-400" />
					</div>
					<div>
						<h3 className="text-lg font-black text-white mb-1">
							Access Denied
						</h3>
						<p className="text-sm text-slate-400 leading-relaxed">
							You do not have permission to access the Admin Dashboard.
							<br />
							Only <span className="text-amber-400 font-bold">ADMIN</span>{" "}
							accounts can view this page.
						</p>
					</div>
					<button
						onClick={onClose}
						className="mt-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors">
						Go Back
					</button>
				</div>
			</div>
		);
	}

	const maxCatProducts = Math.max(
		...topCategories.map((c) => c._count?.products ?? 0),
		1
	);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-5">
			<div
				className="absolute inset-0 bg-black/80 backdrop-blur-xl"
				onClick={onClose}
			/>

			<div className="relative w-full max-w-6xl max-h-[95vh] bg-slate-950 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
				{/* ── Header ── */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 shrink-0">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
							<BarChart2 className="w-5 h-5 text-white" />
						</div>
						<div>
							<h2 className="text-base font-black text-white">
								Admin Dashboard
							</h2>
							<p className="text-[11px] text-slate-400">
								Platform overview & management
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<button
							onClick={() => fetchAll(true)}
							disabled={refreshing}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors">
							<RefreshCw
								className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-400" : ""}`}
							/>
							Refresh
						</button>
						<button
							onClick={onClose}
							className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* ── Body ── */}
				<div className="flex-1 overflow-y-auto p-5 space-y-5">
					{loading ?
						<div className="flex flex-col items-center justify-center py-20 gap-4">
							<div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
								<Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
							</div>
							<p className="text-sm text-slate-400">
								Loading dashboard data...
							</p>
						</div>
					: error ?
						<div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
							<AlertCircle className="w-5 h-5 shrink-0" />
							{error}
						</div>
					:	<>
							{/* ── Stats Grid ── */}
							<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
								<StatCard
									icon={Users}
									label="Total Users"
									value={stats!.totalUsers.toLocaleString()}
									sub={`${stats!.adminUsers} admin${stats!.adminUsers !== 1 ? "s" : ""}`}
									color="border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
								/>
								<StatCard
									icon={Package}
									label="Total Products"
									value={stats!.totalProducts.toLocaleString()}
									sub={`${stats!.activeProducts} active`}
									color="border-purple-500/20 bg-purple-500/5 text-purple-400"
								/>
								<StatCard
									icon={Layers}
									label="Categories"
									value={stats!.totalCategories.toLocaleString()}
									color="border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
								/>
								<StatCard
									icon={DollarSign}
									label="Inventory Value"
									value={`$${stats!.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
									sub={`Avg price: $${stats!.avgPrice.toFixed(2)}`}
									color="border-amber-500/20 bg-amber-500/5 text-amber-400"
								/>
							</div>

							{/* ── Secondary Stats ── */}
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
								{[
									{
										icon: ShieldCheck,
										label: "Admin Accounts",
										value: stats!.adminUsers,
										color: "text-rose-400",
									},
									{
										icon: UserCheck,
										label: "Regular Users",
										value: stats!.totalUsers - stats!.adminUsers,
										color: "text-sky-400",
									},
									{
										icon: Activity,
										label: "Active Products",
										value: stats!.activeProducts,
										color: "text-emerald-400",
									},
									{
										icon: TrendingUp,
										label: "Inactive Products",
										value: stats!.totalProducts - stats!.activeProducts,
										color: "text-slate-400",
									},
								].map((item) => (
									<div
										key={item.label}
										className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 flex items-center gap-3">
										<item.icon className={`w-4 h-4 shrink-0 ${item.color}`} />
										<div className="min-w-0">
											<p className="text-base font-black text-white">
												{item.value}
											</p>
											<p className="text-[11px] text-slate-500 truncate">
												{item.label}
											</p>
										</div>
									</div>
								))}
							</div>

							{/* ── Main Content Row ── */}
							<div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
								{/* Left: Category Bar Chart */}
								<div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
									<div className="flex items-center justify-between mb-4">
										<div>
											<h3 className="text-sm font-bold text-white">
												Products by Category
											</h3>
											<p className="text-[11px] text-slate-500 mt-0.5">
												Distribution overview
											</p>
										</div>
										<button
											onClick={onManageCategories}
											className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors">
											Manage <ArrowUpRight className="w-3 h-3" />
										</button>
									</div>
									{topCategories.length === 0 ?
										<p className="text-xs text-slate-600 text-center py-6">
											No categories yet
										</p>
									:	<div className="space-y-3">
											{topCategories.slice(0, 8).map((cat) => (
												<MiniBar
													key={cat.id}
													label={cat.name}
													value={cat._count?.products ?? 0}
													max={maxCatProducts}
													color="bg-gradient-to-r from-indigo-500 to-purple-500"
												/>
											))}
										</div>
									}
								</div>

								{/* Right: Recent Products */}
								<div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
									<div className="flex items-center justify-between mb-4">
										<div>
											<h3 className="text-sm font-bold text-white">
												Recent Products
											</h3>
											<p className="text-[11px] text-slate-500 mt-0.5">
												Newest listings
											</p>
										</div>
										<button
											onClick={onManageProducts}
											className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors">
											Manage <ArrowUpRight className="w-3 h-3" />
										</button>
									</div>
									<div className="space-y-2">
										{recentProducts.length === 0 ?
											<p className="text-xs text-slate-600 text-center py-6">
												No products yet
											</p>
										:	recentProducts.map((p) => (
												<div
													key={p.id}
													className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors">
													<div className="w-9 h-9 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center shrink-0 overflow-hidden">
														{p.imageUrl ?
															<img
																src={p.imageUrl}
																alt=""
																className="w-full h-full object-cover"
															/>
														:	<Package className="w-4 h-4 text-slate-500" />}
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-xs font-semibold text-slate-200 truncate">
															{p.title}
														</p>
														<div className="flex items-center gap-2 mt-0.5">
															{p.category && (
																<span className="flex items-center gap-0.5 text-[10px] text-purple-400">
																	<Tag className="w-2.5 h-2.5" />
																	{p.category.name}
																</span>
															)}
															<span className="text-[10px] text-slate-500">
																{new Date(p.createdAt).toLocaleDateString(
																	"en-US",
																	{ month: "short", day: "numeric" }
																)}
															</span>
														</div>
													</div>
													<div className="text-right shrink-0">
														<p className="text-xs font-bold text-emerald-400">
															${p.price.toFixed(2)}
														</p>
														<span
															className={`text-[10px] font-bold ${p.status === "ACTIVE" ? "text-emerald-500" : "text-slate-500"}`}>
															{p.status}
														</span>
													</div>
												</div>
											))
										}
									</div>
								</div>
							</div>

							{/* ── Bottom Row ── */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								{/* Recent Users */}
								<div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
									<div className="flex items-center justify-between mb-4">
										<div>
											<h3 className="text-sm font-bold text-white">
												Recent Users
											</h3>
											<p className="text-[11px] text-slate-500 mt-0.5">
												Newest registrations
											</p>
										</div>
										<button
											onClick={onManageUsers}
											className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors">
											Manage <ArrowUpRight className="w-3 h-3" />
										</button>
									</div>
									<div className="space-y-2">
										{recentUsers.length === 0 ?
											<p className="text-xs text-slate-600 text-center py-6">
												No users yet
											</p>
										:	recentUsers.map((u) => (
												<div
													key={u.id}
													className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors">
													<div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
														{u.avatar ?
															<img
																src={u.avatar}
																alt=""
																className="w-8 h-8 rounded-full object-cover"
															/>
														:	u.name.charAt(0).toUpperCase()}
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-xs font-semibold text-slate-200 truncate">
															{u.name}
														</p>
														<p className="text-[10px] text-slate-500 truncate">
															{u.email}
														</p>
													</div>
													<span
														className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-0.5 shrink-0 ${
															u.role === "ADMIN" ?
																"text-amber-400 bg-amber-400/10 border-amber-400/20"
															:	"text-sky-400 bg-sky-400/10 border-sky-400/20"
														}`}>
														{u.role === "ADMIN" && (
															<ShieldCheck className="w-2.5 h-2.5" />
														)}
														{u.role}
													</span>
												</div>
											))
										}
									</div>
								</div>

								{/* Recent Reviews */}
								<div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
									<div className="flex items-center justify-between mb-4">
										<div>
											<h3 className="text-sm font-bold text-white">
												Recent Reviews
											</h3>
											<p className="text-[11px] text-slate-500 mt-0.5">
												Latest customer feedback
											</p>
										</div>
										<Star className="w-4 h-4 text-amber-400" />
									</div>
									<div className="space-y-2">
										{recentReviews.length === 0 ?
											<p className="text-xs text-slate-600 text-center py-6">
												No reviews yet
											</p>
										:	recentReviews.map((r) => (
												<div
													key={r.id}
													className="px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors">
													<div className="flex items-center justify-between mb-1">
														<p className="text-[11px] font-semibold text-slate-300">
															{r.user?.name ?? "Unknown"}
														</p>
														<div className="flex items-center gap-0.5">
															{Array.from({ length: 5 }).map((_, i) => (
																<Star
																	key={i}
																	className={`w-2.5 h-2.5 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`}
																/>
															))}
														</div>
													</div>
													<p className="text-[11px] text-slate-500 truncate">
														{r.comment}
													</p>
													{r.product && (
														<p className="text-[10px] text-purple-400 mt-0.5 truncate flex items-center gap-1">
															<Tag className="w-2.5 h-2.5" />
															{r.product.title}
														</p>
													)}
												</div>
											))
										}
									</div>
								</div>
							</div>

							{/* ── Quick Actions ── */}
							<div className="rounded-2xl border border-slate-800/80 bg-linear-to-br from-slate-900 to-slate-950 p-5">
								<h3 className="text-sm font-bold text-white mb-3">
									Quick Actions
								</h3>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
									{[
										{
											icon: Users,
											label: "Manage Users",
											sub: "Roles & access",
											color:
												"border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-400",
											fn: onManageUsers,
										},
										{
											icon: Package,
											label: "Manage Products",
											sub: "Price, stock, status",
											color:
												"border-purple-500/30 hover:bg-purple-500/10 text-purple-400",
											fn: onManageProducts,
										},
										{
											icon: Layers,
											label: "Categories",
											sub: "Add & edit",
											color:
												"border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400",
											fn: onManageCategories,
										},
										{
											icon: RefreshCw,
											label: "Refresh Data",
											sub: "Reload all stats",
											color:
												"border-amber-500/30 hover:bg-amber-500/10 text-amber-400",
											fn: () => fetchAll(true),
										},
									].map((action) => (
										<button
											key={action.label}
											onClick={action.fn}
											className={`flex flex-col items-start gap-2 p-4 rounded-xl border bg-slate-900/60 transition-all text-left ${action.color}`}>
											<action.icon className="w-5 h-5" />
											<div>
												<p className="text-xs font-bold text-slate-200">
													{action.label}
												</p>
												<p className="text-[10px] text-slate-500">
													{action.sub}
												</p>
											</div>
										</button>
									))}
								</div>
							</div>
						</>
					}
				</div>
			</div>
		</div>
	);
}
