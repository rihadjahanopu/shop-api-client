/* eslint-disable @typescript-eslint/typedef */
"use client";

import React from "react";
import {
	ShieldCheck,
	Zap,
	Database,
	SlidersHorizontal,
	Lock,
	Boxes,
	Sparkles,
	ArrowRight,
} from "lucide-react";

interface FeaturesSectionProps {
	onOpenApiDocs: () => void;
}

export function FeaturesSection({ onOpenApiDocs }: FeaturesSectionProps) {
	const features = [
		{
			icon: Zap,
			title: "RESTful API Architecture",
			description:
				"Clean, predictable endpoints adhering to REST standards with JSON responses, proper HTTP status codes, and structured error handling.",
			color: "text-amber-400",
			badge: "Fast & Stateless",
		},
		{
			icon: Lock,
			title: "JWT Authentication & RBAC",
			description:
				"Secure token authentication with bcrypt password hashing and Role-Based Access Control enforcing Admin and User permissions.",
			color: "text-indigo-400",
			badge: "Security First",
		},
		{
			icon: Database,
			title: "PostgreSQL & Prisma ORM",
			description:
				"Powered by PostgreSQL relational database with type-safe Prisma ORM queries, foreign key constraints, and relational indexing.",
			color: "text-purple-400",
			badge: "Type Safe",
		},
		{
			icon: SlidersHorizontal,
			title: "Real-time Search & Filtering",
			description:
				"Debounced multi-attribute client search, dynamic category filtering, price/date sorting, and backend pagination.",
			color: "text-sky-400",
			badge: "High Performance",
		},
		{
			icon: Boxes,
			title: "Modern Next.js 16 UI",
			description:
				"Built with React 19, Tailwind CSS v4, Lucide icons, responsive glassmorphism designs, and context state management.",
			color: "text-emerald-400",
			badge: "React 19 & Tailwind",
		},
		{
			icon: ShieldCheck,
			title: "Production Ready Security",
			description:
				"Input sanitization, route protection middleware, authorization tokens, CORS handling, and environment isolation.",
			color: "text-pink-400",
			badge: "Enterprise Grade",
		},
	];

	return (
		<section
			id="features"
			className="py-20 bg-slate-950 border-b border-white/5 relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-300 uppercase tracking-widest">
						<Sparkles className="w-3.5 h-3.5" /> Platform Capabilities
					</div>
					<h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
						Engineered for Performance & Developers
					</h2>
					<p className="text-slate-400 text-base leading-relaxed">
						Discover the backend and frontend capabilities powering this modern
						REST platform.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map(({ icon: Icon, title, description, color, badge }) => (
						<div
							key={title}
							className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between">
							<div>
								<div className="flex items-center justify-between mb-4">
									<div
										className={`w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center group-hover:scale-110 transition-transform ${color}`}>
										<Icon className="w-6 h-6" />
									</div>
									<span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/40">
										{badge}
									</span>
								</div>
								<h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
									{title}
								</h3>
								<p className="text-slate-400 text-sm leading-relaxed">
									{description}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* API CTA Banner */}
				<div className="mt-16 p-8 rounded-3xl bg-linear-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
					<div>
						<h3 className="text-xl font-bold text-white mb-1">
							Looking for API Integration Specs?
						</h3>
						<p className="text-sm text-slate-400">
							Explore endpoint specifications, headers, parameters, and code
							snippets.
						</p>
					</div>
					<button
						onClick={onOpenApiDocs}
						className="whitespace-nowrap px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2">
						Open API Reference <ArrowRight className="w-4 h-4" />
					</button>
				</div>
			</div>
		</section>
	);
}
