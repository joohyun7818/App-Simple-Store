import { API_BASE_URL } from "../config";
import type { CartItem, Order, Product, User } from "../types";

type HttpMethod = "GET" | "POST" | "DELETE";

async function request<T>(
  path: string,
  options?: { method?: HttpMethod; body?: unknown }
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = (await res.json().catch(() => null)) as any;
      const message = data?.error || data?.message;
      throw new Error(message || `Request failed: ${res.status}`);
    }
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function fetchProducts(query = ""): Promise<Product[]> {
  const q = query ? `?q=${encodeURIComponent(query)}` : "";
  return request<Product[]>(`/products${q}`);
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  return request<User>("/login", { method: "POST", body: { email, password } });
}

export async function registerUser(
  email: string,
  name: string,
  password: string
): Promise<User> {
  return request<User>("/register", {
    method: "POST",
    body: { email, name, password },
  });
}

export async function fetchCart(email: string): Promise<CartItem[]> {
  return request<CartItem[]>(`/cart?email=${encodeURIComponent(email)}`);
}

export async function addToCart(
  email: string,
  productId: string
): Promise<void> {
  await request<{ success: boolean }>("/cart/add", {
    method: "POST",
    body: { email, productId },
  });
}

export async function updateCartItem(
  email: string,
  productId: string,
  quantity: number
): Promise<void> {
  await request<{ success: boolean }>("/cart/update", {
    method: "POST",
    body: { email, productId, quantity },
  });
}

export async function removeFromCart(
  email: string,
  productId: string
): Promise<void> {
  await request<{ success: boolean }>(
    `/cart/${encodeURIComponent(email)}/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
    }
  );
}

export async function clearCart(email: string): Promise<void> {
  await request<{ success: boolean }>(`/cart/${encodeURIComponent(email)}`, {
    method: "DELETE",
  });
}

export async function fetchOrders(email: string): Promise<Order[]> {
  return request<Order[]>(`/orders?email=${encodeURIComponent(email)}`);
}

export async function placeOrder(
  email: string
): Promise<{ success: boolean; orderId: string }> {
  return request<{ success: boolean; orderId: string }>("/orders", {
    method: "POST",
    body: { email },
  });
}
