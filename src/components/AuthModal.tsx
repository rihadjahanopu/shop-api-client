"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
	mode: "login" | "register";
	onClose: () => void;
	onSwitchMode: (m: "login" | "register") => void;
}

export function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
	const { login, register } = useAuth();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			if (mode === "login") {
				await login(email, password);
			} else {
				await register({ name, email, password });
			}
			onClose();
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 animate-in fade-in-0 zoom-in-95 duration-200">
				{/* Header */}
				<div className="flex items-center justify-between p-6 pb-0">
					<div>
						<h2 className="text-xl font-black text-white">
							{mode === "login" ? "Welcome Back" : "Create Account"}
						</h2>
						<p className="text-sm text-slate-400 mt-0.5">
							{mode === "login" ?
								"Sign in to your account to continue"
							:	"Join the platform and start selling"}
						</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="p-6 flex flex-col gap-4">
					{mode === "register" && (
						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Full Name
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="John Doe"
									required
									className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
								/>
							</div>
						</div>
					)}

					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
							Email Address
						</label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@example.com"
								required
								className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
							/>
						</div>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
							Password
						</label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
							<input
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Min 6 characters"
								required
								minLength={6}
								className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition-all"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
								{showPassword ?
									<EyeOff className="w-4 h-4" />
								:	<Eye className="w-4 h-4" />}
							</button>
						</div>
					</div>

					{error && (
						<div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full py-3 rounded-xl font-bold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
						{loading ?
							<Loader2 className="w-4 h-4 animate-spin" />
						:	null}
						{mode === "login" ? "Sign In" : "Create Account"}
					</button>

					<p className="text-center text-sm text-slate-500">
						{mode === "login" ?
							"Don't have an account?"
						:	"Already have an account?"}{" "}
						<button
							type="button"
							onClick={() =>
								onSwitchMode(mode === "login" ? "register" : "login")
							}
							className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
							{mode === "login" ? "Register" : "Sign In"}
						</button>
					</p>
				</form>
			</div>
		</div>
	);
}
