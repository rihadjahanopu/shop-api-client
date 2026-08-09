/* eslint-disable @typescript-eslint/typedef */
import { ApiResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken(): string | null {
	if (typeof window === "undefined") return null;

	const localToken = localStorage.getItem("jwt_token");
	if (localToken) return localToken;

	const match = document.cookie.match(/(?:^|; )jwt_token=([^;]*)/);
	return match ? decodeURIComponent(match[1]) : null;
}

async function request<T = unknown>(
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	const token = getToken();

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as Record<string, string>),
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers,
	});

	const data: ApiResponse<T> = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Request failed");
	}

	return data;
}

function buildQuery(
	params: Record<string, string | number | boolean | undefined>
): string {
	const q = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) {
		if (v !== undefined && v !== "" && v !== null) q.append(k, String(v));
	}
	return q.toString();
}

export const api = {
	auth: {
		register: (body: {
			name: string;
			email: string;
			password: string;
			role?: string;
		}) =>
			request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
		login: (body: { email: string; password: string }) =>
			request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
		getMe: () => request("/auth/me"),
	},

	users: {
		getAll: (p?: {
			page?: number;
			limit?: number;
			search?: string;
			role?: string;
		}) => request(`/users?${buildQuery(p || {})}`),
		getById: (id: string) => request(`/users/${id}`),
		update: (id: string, body: Record<string, unknown>) =>
			request(`/users/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
		delete: (id: string) => request(`/users/${id}`, { method: "DELETE" }),
	},

	categories: {
		getAll: (p?: { page?: number; limit?: number; search?: string }) =>
			request(`/categories?${buildQuery(p || {})}`),
		getById: (id: string) => request(`/categories/${id}`),
		create: (body: { name: string; description?: string }) =>
			request("/categories", { method: "POST", body: JSON.stringify(body) }),
		update: (id: string, body: { name?: string; description?: string }) =>
			request(`/categories/${id}`, {
				method: "PATCH",
				body: JSON.stringify(body),
			}),
		delete: (id: string) => request(`/categories/${id}`, { method: "DELETE" }),
	},

	products: {
		getAll: (p?: {
			page?: number;
			limit?: number;
			search?: string;
			categoryId?: string;
			sellerId?: string;
			status?: string;
			minPrice?: number;
			maxPrice?: number;
			sortBy?: string;
			sortOrder?: string;
		}) => request(`/products?${buildQuery(p || {})}`),
		getById: (id: string) => request(`/products/${id}`),
		create: (body: Record<string, unknown>) =>
			request("/products", { method: "POST", body: JSON.stringify(body) }),
		update: (id: string, body: Record<string, unknown>) =>
			request(`/products/${id}`, {
				method: "PATCH",
				body: JSON.stringify(body),
			}),
		delete: (id: string) => request(`/products/${id}`, { method: "DELETE" }),
	},

	reviews: {
		getAll: (p?: {
			productId?: string;
			userId?: string;
			page?: number;
			limit?: number;
		}) => request(`/reviews?${buildQuery(p || {})}`),
		create: (body: { productId: string; rating: number; comment: string }) =>
			request("/reviews", { method: "POST", body: JSON.stringify(body) }),
		update: (id: string, body: { rating?: number; comment?: string }) =>
			request(`/reviews/${id}`, {
				method: "PATCH",
				body: JSON.stringify(body),
			}),
		delete: (id: string) => request(`/reviews/${id}`, { method: "DELETE" }),
	},
};
