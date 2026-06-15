"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/api";

function formatCurrency(value: number | string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function OrdersPanel({ orders }: { orders: Order[] }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!selectedOrder) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedOrder(null);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedOrder]);

  return (
    <div className="panel rounded-[2rem] p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Ultimos pedidos</h2>
        {orders.length > 0 && (
          <button
            className="rounded-lg border border-primary/50 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
            onClick={() => setSelectedOrder(orders[0])}
            type="button"
          >
            Ver lista
          </button>
        )}
      </div>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-sm text-muted">Nenhum pedido registrado ainda.</p>
        ) : (
          orders.slice(0, 4).map((order) => (
            <button
              className="w-full rounded-xl border border-white/10 bg-background/50 p-3 text-left transition-colors hover:border-primary/50"
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              type="button"
            >
              <div className="flex justify-between gap-4">
                <strong>
                  #{order.id} {order.customer.name}
                </strong>
                <span className="chip rounded-full px-3 py-1 text-xs">
                  {order.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">
                {formatCurrency(order.total)}
              </p>
            </button>
          ))
        )}
      </div>

      {selectedOrder && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur"
          role="dialog"
        >
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[1.5rem] border border-white/10 bg-background p-6 shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="font-mono text-sm text-primary">
                  Pedido #{selectedOrder.id}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  {selectedOrder.customer.name}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {selectedOrder.customer.email}
                </p>
              </div>
              <div className="text-right">
                <span className="chip rounded-full px-3 py-1 text-xs">
                  {selectedOrder.status}
                </span>
                <p className="mt-3 text-sm text-muted">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {selectedOrder.items.map((item) => (
                <div
                  className="grid gap-2 rounded-xl border border-white/10 bg-card/60 p-4 md:grid-cols-[1fr_auto_auto]"
                  key={item.id}
                >
                  <div>
                    <strong className="block">{item.product.name}</strong>
                    <span className="text-sm text-muted">
                      {item.product.category.name}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-muted">
                    {item.quantity} un.
                  </span>
                  <strong>{formatCurrency(Number(item.unitPrice) * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <button
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-muted transition-colors hover:border-primary/50 hover:text-primary"
                onClick={() => setSelectedOrder(null)}
                type="button"
              >
                Fechar
              </button>
              <div className="text-right">
                <p className="text-sm text-muted">Total do pedido</p>
                <strong className="text-2xl text-primary">
                  {formatCurrency(selectedOrder.total)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
