export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: {
    id: number;
    name: string;
  };
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type Order = {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  items: {
    id: number;
    quantity: number;
    unitPrice: number;
    product: Product;
  }[];
};

const API_URL =
  typeof window === "undefined"
    ? process.env.API_INTERNAL_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:3001"
    : "/api";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init?.headers,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await wait(350 * attempt);
      }
    }
  }

  throw lastError;
}

export function getProducts() {
  return request<Product[]>("/products");
}

export function getCategories() {
  return request<Category[]>("/categories");
}

export function getOrders() {
  return request<Order[]>("/orders");
}

export function createProduct(payload: {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: number;
}) {
  return request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(
  id: number,
  payload: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: number;
  }>,
) {
  return request<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id: number) {
  return request<{ deleted: boolean }>(`/products/${id}`, {
    method: "DELETE",
  });
}

export function createOrder(payload: {
  customer: { name: string; email: string; phone?: string };
  items: { productId: number; quantity: number }[];
}) {
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
