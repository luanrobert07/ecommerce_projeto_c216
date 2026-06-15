"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/api";
import { getProductImage, getProductSpecs, getProductUseCase } from "@/lib/catalog";

type CartItem = Product & { quantity: number };

const CART_KEY = "stackstore-cart";

export function ProductCard({ product }: { product: Product }) {
  const image = getProductImage(product);
  const specs = getProductSpecs(product.name);

  function addToCart() {
    const stored = window.localStorage.getItem(CART_KEY);
    const current = stored ? (JSON.parse(stored) as CartItem[]) : [];
    const existing = current.find((item) => item.id === product.id);
    const next = existing
      ? current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [...current, { ...product, quantity: 1 }];

    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  return (
    <article className="panel group flex min-h-[510px] flex-col rounded-[1.5rem] p-5 transition-transform hover:-translate-y-1">
      <div className="relative mb-5 h-56 overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-950/70">
        <Image
          alt={`Imagem do produto ${product.name}`}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          fill
          priority={product.id <= 2}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={image}
          unoptimized={image.startsWith("data:")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
      </div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="chip rounded-full px-3 py-1 font-mono text-xs">
          {product.category.name}
        </span>
        <span className="text-sm text-muted">{product.stock} em estoque</span>
      </div>
      <h3 className="text-xl font-semibold transition-colors group-hover:text-primary">
        {product.name}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {getProductUseCase(product.name)}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {specs.map((spec) => (
          <span
            className="rounded-full border border-white/10 bg-background/55 px-3 py-1 text-xs text-muted"
            key={spec}
          >
            {spec}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <strong className="text-2xl">
          {Number(product.price).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </strong>
        <Link
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-slate-950 glow transition-opacity hover:opacity-90"
          href="/carrinho"
          onClick={addToCart}
        >
          Comprar
        </Link>
      </div>
    </article>
  );
}
