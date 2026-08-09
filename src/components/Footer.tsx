"use client";

import React, { useState } from "react";
import {
	Sparkles,
	ArrowUp,
	Globe,
	Share2,
	MessageSquare,
	Terminal,
	CheckCircle2,
	Send,
	Code2,
	Database,
	Layers,
	ShieldCheck,
	Zap,
} from "lucide-react";

interface FooterProps {
	onOpenApiDocs?: () => void;
}

export function Footer({ onOpenApiDocs }: FooterProps) {
	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (email.trim()) {
			setSubscribed(true);
			setEmail("");
			setTimeout(() => setSubscribed(false), 4000);
		}
	};

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 relative overflow-hidden">
			{/* Top subtle ambient glow */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

			{/* Main Footer Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
					{/* Column 1: Brand & Bio (Spans 2 columns on lg) */}
					<div className="lg:col-span-2 space-y-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
								<Sparkles className="w-5 h-5 text-white" />
							</div>
							<div>
								<span className="text-xl font-black tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
									ShopAPI
								</span>
								<p className="text-[10px] text-indigo-400 font-semibold tracking-widest uppercase -mt-0.5">
									Production REST Ecosystem
								</p>
							</div>
						</div>

						<p className="text-slate-400 text-sm leading-relaxed max-w-sm">
							An enterprise-grade, high-performance RESTful e-commerce platform
							built with modern TypeScript, Express, Prisma ORM, and PostgreSQL
							database architecture.
						</p>

						{/* System Status Badge */}
						<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
							</span>
							All Systems Operational (99.9% Uptime)
						</div>

						{/* Social Links */}
						<div className="flex items-center gap-3 pt-2">
							{[
								{ icon: Terminal, href: "https://github.com", label: "GitHub" },
								{ icon: Share2, href: "https://twitter.com", label: "Twitter" },
								{
									icon: Globe,
									href: "https://linkedin.com",
									label: "LinkedIn",
								},
								{
									icon: MessageSquare,
									href: "https://discord.com",
									label: "Discord",
								},
							].map(({ icon: Icon, href, label }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={label}
									className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 hover:border-indigo-500/40 transition-all hover:scale-105">
									<Icon className="w-4 h-4" />
								</a>
							))}
						</div>
					</div>

					{/* Column 2: Platform Links */}
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-white uppercase tracking-wider">
							Navigation
						</h3>
						<ul className="space-y-2.5 text-sm">
							<li>
								<a
									href="#hero"
									className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
									<Zap className="w-3.5 h-3.5 text-indigo-400" /> Home Overview
								</a>
							</li>
							<li>
								<a
									href="#catalog"
									className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
									<Layers className="w-3.5 h-3.5 text-indigo-400" /> Product
									Catalog
								</a>
							</li>
							<li>
								<a
									href="#features"
									className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
									<ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />{" "}
									Platform Features
								</a>
							</li>
							<li>
								<button
									onClick={onOpenApiDocs}
									className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-left">
									<Code2 className="w-3.5 h-3.5 text-indigo-400" /> REST API
									Spec
								</button>
							</li>
						</ul>
					</div>

					{/* Column 3: Tech Stack */}
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-white uppercase tracking-wider">
							Tech Architecture
						</h3>
						<ul className="space-y-2.5 text-sm">
							<li className="flex items-center gap-2">
								<Code2 className="w-4 h-4 text-sky-400" />
								<span>Next.js 16 (App Router)</span>
							</li>
							<li className="flex items-center gap-2">
								<Zap className="w-4 h-4 text-emerald-400" />
								<span>Node.js & Express API</span>
							</li>
							<li className="flex items-center gap-2">
								<Database className="w-4 h-4 text-indigo-400" />
								<span>PostgreSQL Database</span>
							</li>
							<li className="flex items-center gap-2">
								<Layers className="w-4 h-4 text-purple-400" />
								<span>Prisma ORM & TypeScript</span>
							</li>
						</ul>
					</div>

					{/* Column 4: Newsletter */}
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-white uppercase tracking-wider">
							Stay Updated
						</h3>
						<p className="text-xs text-slate-400 leading-relaxed">
							Subscribe to receive API changelogs, architecture updates, and
							product releases.
						</p>
						<form
							onSubmit={handleSubscribe}
							className="space-y-2">
							<div className="relative">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="enter your email..."
									required
									className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
								/>
								<button
									type="submit"
									className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all">
									<Send className="w-3 h-3" />
								</button>
							</div>
							{subscribed && (
								<p className="text-xs text-emerald-400 flex items-center gap-1 animate-fade-in">
									<CheckCircle2 className="w-3.5 h-3.5" /> Subscribed
									successfully!
								</p>
							)}
						</form>
					</div>
				</div>

				{/* Bottom Divider & Copyright */}
				<div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
					<p>
						© {new Date().getFullYear()} ShopAPI REST Platform. All rights
						reserved.
					</p>

					<div className="flex items-center gap-6">
						<a
							href="#hero"
							className="hover:text-slate-200 transition-colors">
							Privacy Policy
						</a>
						<a
							href="#hero"
							className="hover:text-slate-200 transition-colors">
							Terms of Service
						</a>
						<a
							href="#hero"
							className="hover:text-slate-200 transition-colors">
							Security
						</a>
						<button
							onClick={scrollToTop}
							className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors ml-2">
							Top <ArrowUp className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
