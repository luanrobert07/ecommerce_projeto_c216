import { ProductCard } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getCategories, getProducts } from "@/lib/api";

export default async function CatalogoPage() {
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
  ]);
  const apiUnavailable = products.length === 0 && categories.length === 0;

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="font-mono text-sm text-primary">02. Catalogo</p>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">
          Curadoria enxuta para setup, performance e entrega.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
          O catalogo foi pensado para uma loja pequena, mas completa: itens
          fisicos de uso diario, upgrade de hardware e um produto digital para
          apoiar organizacao tecnica.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <div
              className="rounded-2xl border border-white/10 bg-card/70 px-4 py-3"
              key={category.id}
            >
              <strong className="block text-sm text-foreground">{category.name}</strong>
              <span className="text-xs text-muted">{category.description}</span>
            </div>
          ))}
        </div>
        {apiUnavailable && (
          <div className="panel mt-10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-primary">
              API ainda nao respondeu
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Aguarde alguns segundos e atualize a pagina. No Docker, a API pode
              levar um pouco mais para conectar ao PostgreSQL e executar o seed
              inicial.
            </p>
          </div>
        )}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
