/* eslint-disable @typescript-eslint/typedef */
"use client";

import React, { useState } from "react";
import {
	X,
	Code2,
	Copy,
	Check,
	Terminal,
	Lock,
	Globe,
	ChevronDown,
	ChevronRight,
	Info,
	Hash,
	FileText,
	Key,
} from "lucide-react";

interface ApiDocsModalProps {
	onClose: () => void;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ParamType = "string" | "number" | "boolean" | "enum";

interface Param {
	name: string;
	type: ParamType;
	required: boolean;
	description: string;
	example?: string;
	enum?: string[];
}

interface EndpointDef {
	method: "GET" | "POST" | "PATCH" | "DELETE";
	path: string;
	title: string;
	authRequired: boolean;
	adminOnly?: boolean;
	description: string;
	queryParams?: Param[];
	bodyParams?: Param[];
	curl: string;
	response: string;
}

// ─── Env-driven Base URL ─────────────────────────────────────────────────────
const API_ENV =
	(typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
	"http://localhost:5000/api";
const ORIGIN = API_ENV.replace(/\/api$/, "").replace(/\/$/, "");
const API_V1 = `${ORIGIN}/api/v1`;

// ─── Endpoint Data ────────────────────────────────────────────────────────────

function getEndpoints(
	base: string
): { group: string; color: string; items: EndpointDef[] }[] {
	return [
		{
			group: "Authentication",
			color: "indigo",
			items: [
				{
					method: "POST",
					path: "/api/v1/auth/register",
					title: "Register New User",
					authRequired: false,
					description:
						"Creates a new user account. Returns a JWT token and user object upon success. All registered accounts default to the USER role.",
					bodyParams: [
						{
							name: "name",
							type: "string",
							required: true,
							description: "Full name of the user",
							example: "John Doe",
						},
						{
							name: "email",
							type: "string",
							required: true,
							description: "Valid email address (must be unique)",
							example: "john@example.com",
						},
						{
							name: "password",
							type: "string",
							required: true,
							description: "Minimum 6 characters, maximum 100 characters",
							example: "securePass123",
						},
						{
							name: "avatar",
							type: "string",
							required: false,
							description: "Profile picture URL (optional)",
							example: "https://example.com/photo.jpg",
						},
					],
					curl: `curl -X POST "${base}/auth/register" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePass123"
  }'`,
					response: `{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "clx1abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "avatar": null,
      "createdAt": "2026-08-09T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`,
				},
				{
					method: "POST",
					path: "/api/v1/auth/login",
					title: "User Login",
					authRequired: false,
					description:
						"Authenticates user credentials. Returns a JWT Bearer token required for all protected endpoints.",
					bodyParams: [
						{
							name: "email",
							type: "string",
							required: true,
							description: "Registered email address",
							example: "john@example.com",
						},
						{
							name: "password",
							type: "string",
							required: true,
							description: "Account password",
							example: "securePass123",
						},
					],
					curl: `curl -X POST "${base}/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "securePass123"
  }'`,
					response: `{
  "success": true,
  "data": {
    "user": {
      "id": "clx1abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}`,
				},
				{
					method: "GET",
					path: "/api/v1/auth/me",
					title: "Get My Profile",
					authRequired: true,
					description:
						"Fetches profile details of the currently authenticated user. Requires a valid JWT Bearer token.",
					curl: `curl -X GET "${base}/auth/me" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
					response: `{
  "success": true,
  "data": {
    "id": "clx1abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "avatar": null,
    "createdAt": "2026-08-09T10:00:00.000Z"
  }
}`,
				},
			],
		},
		{
			group: "Products",
			color: "purple",
			items: [
				{
					method: "GET",
					path: "/api/v1/products",
					title: "List All Products",
					authRequired: false,
					description:
						"Retrieves a paginated list of active products. Supports text search, category filtering, price range, and multi-field sorting.",
					queryParams: [
						{
							name: "page",
							type: "number",
							required: false,
							description: "Page number (default: 1)",
							example: "1",
						},
						{
							name: "limit",
							type: "number",
							required: false,
							description: "Items per page, max 100 (default: 12)",
							example: "12",
						},
						{
							name: "search",
							type: "string",
							required: false,
							description: "Search term matching title or description",
							example: "laptop",
						},
						{
							name: "categoryId",
							type: "string",
							required: false,
							description: "Filter by category ID",
							example: "clx1cat001",
						},
						{
							name: "minPrice",
							type: "number",
							required: false,
							description: "Minimum price filter",
							example: "100",
						},
						{
							name: "maxPrice",
							type: "number",
							required: false,
							description: "Maximum price filter",
							example: "5000",
						},
						{
							name: "sortBy",
							type: "enum",
							required: false,
							description: "Sort attribute",
							example: "price",
							enum: ["createdAt", "price", "title"],
						},
						{
							name: "sortOrder",
							type: "enum",
							required: false,
							description: "Sort direction",
							example: "asc",
							enum: ["asc", "desc"],
						},
						{
							name: "status",
							type: "enum",
							required: false,
							description: "Product status filter",
							example: "ACTIVE",
							enum: ["ACTIVE", "INACTIVE"],
						},
					],
					curl: `curl -X GET "${base}/products?page=1&limit=12&search=laptop&sortBy=price&sortOrder=asc" \\
  -H "Accept: application/json"`,
					response: `{
  "success": true,
  "data": [
    {
      "id": "clx1prod001",
      "title": "Gaming Laptop Pro",
      "description": "High-performance gaming laptop with RTX 4080",
      "price": 2499.99,
      "stock": 15,
      "status": "ACTIVE",
      "category": { "id": "clx1cat001", "name": "Electronics" },
      "seller": { "id": "clx1abc123", "name": "John Doe" }
    }
  ],
  "meta": { "page": 1, "limit": 12, "total": 48, "totalPages": 4 }
}`,
				},
				{
					method: "POST",
					path: "/api/v1/products",
					title: "Create Product",
					authRequired: true,
					description:
						"Creates a new product listing. Requires authentication. Pass JWT token in Authorization header.",
					bodyParams: [
						{
							name: "title",
							type: "string",
							required: true,
							description: "Product title (min 2 chars)",
							example: "Gaming Laptop Pro",
						},
						{
							name: "description",
							type: "string",
							required: true,
							description: "Product description (min 10 chars)",
							example: "High-performance gaming laptop with RTX 4080",
						},
						{
							name: "price",
							type: "number",
							required: true,
							description: "Product price (must be greater than 0)",
							example: "2499.99",
						},
						{
							name: "stock",
							type: "number",
							required: true,
							description: "Inventory stock count",
							example: "15",
						},
						{
							name: "categoryId",
							type: "string",
							required: true,
							description: "Valid category ID from categories endpoint",
							example: "clx1cat001",
						},
						{
							name: "images",
							type: "string",
							required: false,
							description: "Array of image URLs",
							example: '["https://example.com/img1.jpg"]',
						},
					],
					curl: `curl -X POST "${base}/products" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Gaming Laptop Pro",
    "description": "High-performance gaming laptop with RTX 4080",
    "price": 2499.99,
    "stock": 15,
    "categoryId": "clx1cat001"
  }'`,
					response: `{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "clx1prod001",
    "title": "Gaming Laptop Pro",
    "price": 2499.99,
    "stock": 15,
    "status": "ACTIVE",
    "createdAt": "2026-08-09T10:00:00.000Z"
  }
}`,
				},
				{
					method: "GET",
					path: "/api/v1/products/:id",
					title: "Get Product by ID",
					authRequired: false,
					description:
						"Fetches detailed information for a single product, including category details, seller info, and reviews.",
					queryParams: [
						{
							name: ":id",
							type: "string",
							required: true,
							description: "Unique product ID (URL parameter)",
							example: "clx1prod001",
						},
					],
					curl: `curl -X GET "${base}/products/clx1prod001" \\
  -H "Accept: application/json"`,
					response: `{
  "success": true,
  "data": {
    "id": "clx1prod001",
    "title": "Gaming Laptop Pro",
    "description": "High-performance gaming laptop with RTX 4080",
    "price": 2499.99,
    "stock": 15,
    "status": "ACTIVE",
    "category": { "id": "clx1cat001", "name": "Electronics" },
    "seller": { "id": "clx1abc123", "name": "John Doe" },
    "reviews": []
  }
}`,
				},
				{
					method: "PATCH",
					path: "/api/v1/products/:id",
					title: "Update Product",
					authRequired: true,
					description:
						"Updates specified fields of a product. Accessible only by product owner or ADMIN users.",
					bodyParams: [
						{
							name: "title",
							type: "string",
							required: false,
							description: "Updated product title",
							example: "Updated Laptop Pro Max",
						},
						{
							name: "price",
							type: "number",
							required: false,
							description: "Updated product price",
							example: "1999.99",
						},
						{
							name: "stock",
							type: "number",
							required: false,
							description: "Updated stock count",
							example: "20",
						},
						{
							name: "status",
							type: "enum",
							required: false,
							description: "Updated product status",
							example: "INACTIVE",
							enum: ["ACTIVE", "INACTIVE"],
						},
					],
					curl: `curl -X PATCH "${base}/products/clx1prod001" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "price": 1999.99, "stock": 20 }'`,
					response: `{
  "success": true,
  "message": "Product updated successfully",
  "data": { "id": "clx1prod001", "price": 1999.99, "stock": 20 }
}`,
				},
				{
					method: "DELETE",
					path: "/api/v1/products/:id",
					title: "Delete Product",
					authRequired: true,
					description:
						"Deletes a product listing. Accessible only by product owner or ADMIN users.",
					queryParams: [
						{
							name: ":id",
							type: "string",
							required: true,
							description: "Product ID to delete",
							example: "clx1prod001",
						},
					],
					curl: `curl -X DELETE "${base}/products/clx1prod001" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
					response: `{
  "success": true,
  "message": "Product deleted successfully"
}`,
				},
			],
		},
		{
			group: "Categories",
			color: "emerald",
			items: [
				{
					method: "GET",
					path: "/api/v1/categories",
					title: "List All Categories",
					authRequired: false,
					description:
						"Retrieves all available product categories. Use category IDs for product filtering and creation.",
					queryParams: [
						{
							name: "page",
							type: "number",
							required: false,
							description: "Page number",
							example: "1",
						},
						{
							name: "limit",
							type: "number",
							required: false,
							description: "Items per page",
							example: "100",
						},
						{
							name: "search",
							type: "string",
							required: false,
							description: "Search categories by name",
							example: "electronics",
						},
					],
					curl: `curl -X GET "${base}/categories?limit=100" \\
  -H "Accept: application/json"`,
					response: `{
  "success": true,
  "data": [
    { "id": "clx1cat001", "name": "Electronics", "description": "Electronic gadgets & devices" },
    { "id": "clx1cat002", "name": "Clothing", "description": "Fashion & apparel" }
  ],
  "meta": { "page": 1, "limit": 100, "total": 8 }
}`,
				},
				{
					method: "POST",
					path: "/api/v1/categories",
					title: "Create Category",
					authRequired: true,
					adminOnly: true,
					description:
						"Creates a new product category. Requires ADMIN authorization.",
					bodyParams: [
						{
							name: "name",
							type: "string",
							required: true,
							description: "Category name (must be unique)",
							example: "Electronics",
						},
						{
							name: "description",
							type: "string",
							required: false,
							description: "Category description",
							example: "Electronic gadgets & devices",
						},
					],
					curl: `curl -X POST "${base}/categories" \\
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "name": "Electronics", "description": "Electronic gadgets & devices" }'`,
					response: `{
  "success": true,
  "message": "Category created successfully",
  "data": { "id": "clx1cat001", "name": "Electronics" }
}`,
				},
			],
		},
		{
			group: "Users",
			color: "amber",
			items: [
				{
					method: "GET",
					path: "/api/v1/users",
					title: "List All Users",
					authRequired: true,
					adminOnly: true,
					description:
						"Retrieves a list of registered users. Requires ADMIN authorization.",
					queryParams: [
						{
							name: "page",
							type: "number",
							required: false,
							description: "Page number",
							example: "1",
						},
						{
							name: "limit",
							type: "number",
							required: false,
							description: "Items per page",
							example: "50",
						},
						{
							name: "search",
							type: "string",
							required: false,
							description: "Search users by name or email",
							example: "john",
						},
						{
							name: "role",
							type: "enum",
							required: false,
							description: "Filter users by role",
							example: "ADMIN",
							enum: ["ADMIN", "USER"],
						},
					],
					curl: `curl -X GET "${base}/users?limit=50" \\
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"`,
					response: `{
  "success": true,
  "data": [
    { "id": "clx1abc123", "name": "John Doe", "email": "john@example.com", "role": "USER" }
  ],
  "meta": { "page": 1, "limit": 50, "total": 120 }
}`,
				},
				{
					method: "PATCH",
					path: "/api/v1/users/:id",
					title: "Update User Role",
					authRequired: true,
					adminOnly: true,
					description:
						"Updates a user role (USER ↔ ADMIN). Requires ADMIN authorization.",
					bodyParams: [
						{
							name: "role",
							type: "enum",
							required: true,
							description: "New role to assign",
							example: "ADMIN",
							enum: ["ADMIN", "USER"],
						},
						{
							name: "name",
							type: "string",
							required: false,
							description: "Updated user name (optional)",
							example: "Jane Doe",
						},
					],
					curl: `curl -X PATCH "${base}/users/clx1abc123" \\
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "role": "ADMIN" }'`,
					response: `{
  "success": true,
  "message": "User updated successfully",
  "data": { "id": "clx1abc123", "role": "ADMIN" }
}`,
				},
			],
		},
	];
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
	const colors: Record<string, string> = {
		GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
		POST: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
		PATCH: "bg-amber-500/15 text-amber-400 border-amber-500/30",
		DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
	};
	return (
		<span
			className={`text-[10px] font-black px-2 py-0.5 rounded border ${colors[method] ?? ""}`}>
			{method}
		</span>
	);
}

function ParamRow({ p }: { p: Param }) {
	return (
		<tr className="border-b border-slate-800/60">
			<td className="px-3.5 py-2.5 align-top">
				<code className="text-xs font-mono text-indigo-300 font-semibold">
					{p.name}
				</code>
			</td>
			<td className="px-3.5 py-2.5 align-top">
				<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
					{p.type}
				</span>
			</td>
			<td className="px-3.5 py-2.5 align-top">
				{p.required ?
					<span className="text-[10px] font-bold text-red-400">required</span>
				:	<span className="text-[10px] text-slate-600">optional</span>}
			</td>
			<td className="px-3.5 py-2.5 align-top">
				<p className="text-xs text-slate-300">{p.description}</p>
				{p.enum && (
					<p className="text-[11px] text-slate-500 mt-0.5">
						Options:{" "}
						{p.enum.map((v) => (
							<code
								key={v}
								className="mx-0.5 px-1 py-0.5 bg-slate-800 rounded text-purple-400">
								{v}
							</code>
						))}
					</p>
				)}
				{p.example && !p.enum && (
					<p className="text-[11px] text-slate-500 mt-0.5">
						e.g.{" "}
						<code className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">
							{p.example}
						</code>
					</p>
				)}
			</td>
		</tr>
	);
}

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);
	const handleCopy = () => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};
	return (
		<button
			onClick={handleCopy}
			className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
			{copied ?
				<Check className="w-3 h-3 text-emerald-400" />
			:	<Copy className="w-3 h-3" />}
			{copied ? "Copied!" : "Copy"}
		</button>
	);
}

function EndpointPanel({ ep }: { ep: EndpointDef }) {
	const [open, setOpen] = useState(false);
	const [urlCopied, setUrlCopied] = useState(false);

	const fullUrl = `${ORIGIN}${ep.path}`;

	const copyUrl = (e: React.MouseEvent) => {
		e.stopPropagation();
		navigator.clipboard.writeText(fullUrl);
		setUrlCopied(true);
		setTimeout(() => setUrlCopied(false), 2000);
	};

	return (
		<div
			className={`rounded-xl border transition-all ${open ? "border-slate-600/80 bg-slate-900" : "border-slate-800/80 bg-slate-900/40 hover:border-slate-700"}`}>
			<div
				onClick={() => setOpen(!open)}
				className="w-full text-left px-4 py-3 flex items-center gap-3 cursor-pointer select-none">
				<MethodBadge method={ep.method} />
				<code className="flex-1 text-xs font-mono text-slate-200 font-semibold truncate">
					{ep.path}
				</code>

				<button
					type="button"
					onClick={copyUrl}
					title={`Copy: ${fullUrl}`}
					className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all shrink-0 ${
						urlCopied ?
							"bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
						:	"bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600"
					}`}>
					{urlCopied ?
						<>
							<Check className="w-3 h-3" /> Copied!
						</>
					:	<>
							<Copy className="w-3 h-3" /> URL
						</>
					}
				</button>

				{ep.authRequired &&
					(ep.adminOnly ?
						<span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded shrink-0">
							<Lock className="w-2.5 h-2.5" /> ADMIN ONLY
						</span>
					:	<span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded shrink-0">
							<Lock className="w-2.5 h-2.5" /> Auth
						</span>)}
				{!ep.authRequired && (
					<span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded shrink-0">
						<Globe className="w-2.5 h-2.5" /> Public
					</span>
				)}
				<span className="text-slate-400 ml-1 shrink-0">
					{open ?
						<ChevronDown className="w-4 h-4" />
					:	<ChevronRight className="w-4 h-4" />}
				</span>
			</div>

			{open && (
				<div className="px-4 pb-5 space-y-5 border-t border-slate-800">
					<div className="pt-4">
						<h4 className="text-sm font-bold text-white mb-1">{ep.title}</h4>
						<p className="text-xs text-slate-300 leading-relaxed">
							{ep.description}
						</p>
					</div>

					{ep.authRequired && (
						<div
							className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-xs ${
								ep.adminOnly ?
									"bg-red-500/5 border-red-500/20 text-red-300"
								:	"bg-amber-500/5 border-amber-500/20 text-amber-300"
							}`}>
							<Key className="w-3.5 h-3.5 shrink-0 mt-0.5" />
							<div>
								<p className="font-bold mb-0.5">
									{ep.adminOnly ?
										"ADMIN Authorization Required"
									:	"Authorization Required"}
								</p>
								<p className="text-slate-400">
									Pass in Header:{" "}
									<code className="bg-slate-800 px-1.5 py-0.5 rounded text-yellow-300">
										Authorization: Bearer {"<"}your_token{">"}
									</code>
								</p>
							</div>
						</div>
					)}

					{ep.queryParams && ep.queryParams.length > 0 && (
						<div>
							<p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
								<Hash className="w-3.5 h-3.5 text-slate-500" />
								{ep.path.includes(":") ?
									"Path & Query Parameters"
								:	"Query Parameters"}
							</p>
							<div className="rounded-lg border border-slate-800 overflow-hidden">
								<table className="w-full text-xs">
									<thead>
										<tr className="bg-slate-800/80 text-slate-500 text-left">
											<th className="px-3.5 py-2.5 font-semibold">Parameter</th>
											<th className="px-3.5 py-2.5 font-semibold">Type</th>
											<th className="px-3.5 py-2.5 font-semibold">Required</th>
											<th className="px-3.5 py-2.5 font-semibold">
												Description
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-800/40">
										{ep.queryParams.map((p) => (
											<tr key={p.name}>
												<td className="px-3.5 py-2.5 align-top">
													<code className="text-indigo-300 font-semibold">
														{p.name}
													</code>
												</td>
												<td className="px-3.5 py-2.5 align-top">
													<span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
														{p.type}
													</span>
												</td>
												<td className="px-3.5 py-2.5 align-top">
													{p.required ?
														<span className="text-[10px] font-bold text-red-400">
															required
														</span>
													:	<span className="text-[10px] text-slate-600">
															optional
														</span>
													}
												</td>
												<td className="px-3.5 py-2.5 align-top text-slate-300">
													{p.description}
													{p.enum && (
														<p className="text-[11px] text-slate-500 mt-0.5">
															Options:{" "}
															{p.enum.map((v) => (
																<code
																	key={v}
																	className="mx-0.5 px-1 py-0.5 bg-slate-800 rounded text-purple-400">
																	{v}
																</code>
															))}
														</p>
													)}
													{p.example && !p.enum && (
														<p className="text-[11px] text-slate-500 mt-0.5">
															e.g.{" "}
															<code className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">
																{p.example}
															</code>
														</p>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{ep.bodyParams && ep.bodyParams.length > 0 && (
						<div>
							<p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
								<FileText className="w-3.5 h-3.5 text-slate-500" />
								Request Body (JSON)
							</p>
							<div className="rounded-lg border border-slate-800 overflow-hidden">
								<table className="w-full text-xs">
									<thead>
										<tr className="bg-slate-800/80 text-slate-500 text-left">
											<th className="px-3.5 py-2.5 font-semibold">Field</th>
											<th className="px-3.5 py-2.5 font-semibold">Type</th>
											<th className="px-3.5 py-2.5 font-semibold">Required</th>
											<th className="px-3.5 py-2.5 font-semibold">
												Description
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-800/40">
										{ep.bodyParams.map((p) => (
											<ParamRow
												key={p.name}
												p={p}
											/>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					<div>
						<div className="flex items-center justify-between mb-1.5">
							<p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
								<Terminal className="w-3.5 h-3.5 text-slate-500" />
								cURL Example
							</p>
							<CopyButton text={ep.curl} />
						</div>
						<pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
							{ep.curl}
						</pre>
					</div>

					<div>
						<div className="flex items-center justify-between mb-1.5">
							<p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
								<Code2 className="w-3.5 h-3.5 text-slate-500" />
								200 OK — Response Example
							</p>
							<CopyButton text={ep.response} />
						</div>
						<pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre-wrap">
							{ep.response}
						</pre>
					</div>
				</div>
			)}
		</div>
	);
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function ApiDocsModal({ onClose }: ApiDocsModalProps) {
	const [activeGroup, setActiveGroup] = useState("Authentication");

	const groupColors: Record<string, string> = {
		Authentication: "indigo",
		Products: "purple",
		Categories: "emerald",
		Users: "amber",
	};

	const colorMap: Record<string, string> = {
		indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
		purple: "text-purple-400 bg-purple-500/10 border-purple-500/30",
		emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
		amber: "text-amber-400 bg-amber-500/10 border-amber-500/30",
	};

	const activeColorMap: Record<string, string> = {
		indigo: "bg-indigo-600/20 border-indigo-500/50 text-indigo-300",
		purple: "bg-purple-600/20 border-purple-500/50 text-purple-300",
		emerald: "bg-emerald-600/20 border-emerald-500/50 text-emerald-300",
		amber: "bg-amber-600/20 border-amber-500/50 text-amber-300",
	};

	const endpoints = getEndpoints(API_V1);
	const currentGroup = endpoints.find((g) => g.group === activeGroup);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-xl">
			<div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
				<div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
							<Code2 className="w-5 h-5 text-indigo-400" />
						</div>
						<div>
							<h2 className="text-base font-black text-white">
								ShopAPI — REST Reference
							</h2>
							<p className="text-[11px] text-slate-400">
								Complete REST endpoint specifications, parameters, and code
								examples
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="px-5 py-2.5 border-b border-slate-800 bg-slate-950/30 flex items-center gap-3 shrink-0 flex-wrap">
					<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
						Base URL
					</span>
					<code className="text-xs font-mono text-emerald-400 font-semibold">
						{API_V1}
					</code>
					<a
						href={`${ORIGIN}/api/docs/openapi.json`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors">
						OpenAPI Spec (.json)
					</a>
					<div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-500">
						<Info className="w-3.5 h-3.5" />
						Click any endpoint to expand details
					</div>
				</div>

				<div className="flex-1 overflow-hidden flex min-h-0">
					<div className="w-52 sm:w-60 shrink-0 border-r border-slate-800 p-3 space-y-1.5 overflow-y-auto bg-slate-950/20">
						<p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-2 mb-3">
							Endpoints
						</p>
						{endpoints.map((g) => {
							const color = groupColors[g.group] ?? "indigo";
							const isActive = activeGroup === g.group;
							return (
								<button
									key={g.group}
									onClick={() => setActiveGroup(g.group)}
									className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between gap-2 ${
										isActive ?
											activeColorMap[color]
										:	"text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200"
									}`}>
									<span className="truncate">{g.group}</span>
									<span
										className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold shrink-0 ${isActive ? "" : colorMap[color]}`}>
										{g.items.length}
									</span>
								</button>
							);
						})}
					</div>

					<div className="flex-1 overflow-y-auto p-4 space-y-3">
						{currentGroup?.items.map((ep) => (
							<EndpointPanel
								key={ep.method + ep.path}
								ep={ep}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
