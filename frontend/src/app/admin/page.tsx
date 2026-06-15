import { AdminGate } from "@/components/AdminGate";
import { OrdersPanel } from "@/components/OrdersPanel";
import { ProductInventory } from "@/components/ProductInventory";
import { ProductForm } from "@/components/ProductForm";
import { SiteHeader } from "@/components/SiteHeader";
import { getCategories, getOrders, getProducts } from "@/lib/api";

export default async function AdminPage() {
  const [products, categories, orders] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
    getOrders().catch(() => []),
  ]);
  const apiUnavailable = products.length === 0 && categories.length === 0;

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <AdminGate>
        <section className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-mono text-sm text-primary">04. Administração</p>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Administração da StackStore
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
            Administração da StackStore: volume de produtos, categorias, pedidos criados e estoque atualizado pelas compras.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Produtos", products.length],
              ["Categorias", categories.length],
              ["Pedidos", orders.length],
            ].map(([label, value]) => (
              <div className="panel rounded-2xl p-5" key={label}>
                <p className="text-sm text-muted">{label}</p>
                <strong className="mt-2 block text-4xl text-primary">{value}</strong>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <ProductForm categories={categories} />
            <OrdersPanel orders={orders} />
          </div>
          {apiUnavailable && (
            <div className="panel mt-10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-primary">
                API ainda não respondeu
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Aguarde alguns segundos e atualize a página. Quando o backend
                terminar de subir, as categorias, produtos e pedidos aparecem
                aqui automaticamente.
              </p>
            </div>
          )}
          <div className="mt-10 grid gap-6">
            <ProductInventory categories={categories} products={products} />
          </div>
        </section>
      </AdminGate>
    </main>
  );
}
