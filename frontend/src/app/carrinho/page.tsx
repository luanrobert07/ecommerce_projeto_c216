"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { createOrder, getProducts, Product } from "@/lib/api";
import { getProductImage } from "@/lib/catalog";

type CartItem = Product & { quantity: number };

const CART_KEY = "stackstore-cart";

function getInitialCart() {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(CART_KEY);
  return stored ? (JSON.parse(stored) as CartItem[]) : [];
}

export default function CarrinhoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart],
  );

  function addProduct(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function removeProduct(productId: number) {
    setCart((current) => current.filter((item) => item.id !== productId));
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      const order = await createOrder({
        customer: {
          name: String(form.get("name")),
          email: String(form.get("email")),
          phone: String(form.get("phone")),
        },
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
      });
      setCart([]);
      setMessage(`Pedido #${order.id} criado com sucesso.`);
      formElement.reset();
    } catch {
      setMessage("Nao foi possivel criar o pedido. Confira se a API esta rodando.");
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="font-mono text-sm text-primary">03. Carrinho</p>
          <h1 className="mt-4 text-4xl font-bold">
            Simule uma compra.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            Escolha os produtos, preencha os dados do cliente e finalize.
          </p>
          <div className="mt-8 grid gap-4">
            {products.map((product) => (
              <button
                className="panel grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-2xl p-4 text-left transition-colors hover:border-primary/50"
                key={product.id}
                onClick={() => addProduct(product)}
                type="button"
              >
                <span className="relative h-16 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
                  <Image
                    alt={`Miniatura de ${product.name}`}
                    className="object-cover"
                    fill
                    sizes="72px"
                    src={getProductImage(product)}
                    unoptimized={getProductImage(product).startsWith("data:")}
                  />
                </span>
                <span>
                  <strong className="block">{product.name}</strong>
                  <span className="text-sm text-muted">
                    {product.category.name} -{" "}
                    {Number(product.price).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </span>
                <span className="font-mono text-primary">Adicionar</span>
              </button>
            ))}
          </div>
        </div>
        <form className="panel rounded-[2rem] p-6" onSubmit={submitOrder}>
          <h2 className="text-2xl font-semibold">Checkout</h2>
          <p className="mt-2 text-sm text-muted">
            Dados usados para criar ou localizar o cliente.
          </p>
          <div className="mt-6 space-y-3">
            {cart.length === 0 ? (
              <p className="text-muted">Adicione produtos para fechar o pedido.</p>
            ) : (
              cart.map((item) => (
                <div
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-xl border border-white/10 bg-background/50 p-3"
                  key={item.id}
                >
                  <span>
                    {item.name}
                    <span className="ml-2 text-muted">x{item.quantity}</span>
                  </span>
                  <span>
                    {(Number(item.price) * item.quantity).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <button
                    className="rounded-lg border border-white/10 px-3 py-1 text-xs text-muted hover:text-primary"
                    onClick={() => removeProduct(item.id)}
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 grid gap-4">
            <input
              className="rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
              name="name"
              placeholder="Nome do cliente"
              required
            />
            <input
              className="rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
              name="email"
              placeholder="email@exemplo.com"
              required
              type="email"
            />
            <input
              className="rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
              name="phone"
              placeholder="Telefone"
            />
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <strong>Total</strong>
            <strong className="text-2xl text-primary">
              {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </strong>
          </div>
          <button
            className="mt-6 w-full rounded-xl bg-primary px-5 py-4 font-semibold text-slate-950 disabled:opacity-40"
            disabled={cart.length === 0}
            type="submit"
          >
            Finalizar pedido
          </button>
          {message && <p className="mt-4 text-sm text-primary">{message}</p>}
        </form>
      </section>
    </main>
  );
}
