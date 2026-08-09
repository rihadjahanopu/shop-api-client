/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/typedef */
"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
} from "react";
import { User } from "@/types";
import { api } from "@/lib/api";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (data: {
		name: string;
		email: string;
		password: string;
		role?: string;
	}) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getSavedToken(): string | null {
	if (typeof window === "undefined") return null;

	// 1. Check localStorage
	const localToken = localStorage.getItem("jwt_token");
	if (localToken) return localToken;

	// 2. Fallback to Cookie
	const match = document.cookie.match(/(?:^|; )jwt_token=([^;]*)/);
	return match ? decodeURIComponent(match[1]) : null;
}

function getSavedUser(): User | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem("jwt_user");
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

function setAuthSession(token: string, u: User) {
	if (typeof window === "undefined") return;
	localStorage.setItem("jwt_token", token);
	localStorage.setItem("jwt_user", JSON.stringify(u));
	document.cookie = `jwt_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
}

function clearAuthSession() {
	if (typeof window === "undefined") return;
	localStorage.removeItem("jwt_token");
	localStorage.removeItem("jwt_user");
	document.cookie =
		"jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(() => getSavedUser());
	const [isLoading, setIsLoading] = useState(true);

	const logout = useCallback(() => {
		clearAuthSession();
		setUser(null);
	}, []);

	const fetchMe = useCallback(async () => {
		const token = getSavedToken();
		if (!token) {
			setIsLoading(false);
			return;
		}

		try {
			const res = await api.auth.getMe();
			if (res.success && res.data) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const freshUser = (res.data as any).user ?? res.data;
				setUser(freshUser);
				localStorage.setItem("jwt_user", JSON.stringify(freshUser));
			} else {
				logout();
			}
		} catch {
			// If network fails temporarily, keep cached user so page reload doesn't force logout
			if (!getSavedUser()) {
				logout();
			}
		} finally {
			setIsLoading(false);
		}
	}, [logout]);

	useEffect(() => {
		fetchMe();
	}, [fetchMe]);

	const login = async (email: string, password: string) => {
		const res = await api.auth.login({ email, password });
		if (res.success && res.data) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const { user: u, token } = res.data as any;
			setAuthSession(token, u);
			setUser(u);
		} else {
			throw new Error(res.message || "Login failed");
		}
	};

	const register = async (data: {
		name: string;
		email: string;
		password: string;
		role?: string;
	}) => {
		const res = await api.auth.register(data);
		if (res.success && res.data) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const { user: u, token } = res.data as any;
			setAuthSession(token, u);
			setUser(u);
		} else {
			throw new Error(res.message || "Registration failed");
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isLoading,
				login,
				register,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
