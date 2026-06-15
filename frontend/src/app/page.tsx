import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteHeader";
import { getProducts } from "@/lib/api";

export default async function Home() {
  const products = await getProducts().catch(() => []);

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <SiteHeader />
      <section className="relative px-6 py-12 md:py-16">
        <div className="relative mx-auto min-h-[680px] max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950">
          <Image
            alt="Setup premium de produtos tech da StackStore"
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src="/images/hero-stackstore.png"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="relative z-10 flex min-h-[680px] max-w-3xl flex-col justify-center px-6 py-16 md:px-12">
            <div className="chip mb-5 inline-flex rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.22em]">
              loja de setup para devs
            </div>
            <h1 className="max-w-4xl text-4xl font-bold md:text-6xl">
              Equipamentos escolhidos para uma rotina tecnica mais fluida.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              A StackStore reune perifericos, hardware e materiais digitais
              para estudantes e desenvolvedores que querem montar um setup
              funcional, bonito e pronto para projetos reais.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                className="rounded-xl bg-gradient-to-r from-primary to-accent px-7 py-4 font-mono text-sm font-semibold text-slate-950 glow"
                href="/catalogo"
              >
                Ver catalogo
              </Link>
              <Link
                className="rounded-xl border border-primary px-7 py-4 font-mono text-sm text-primary transition-colors hover:bg-primary/10"
                href="/admin"
              >
                Painel da loja
              </Link>
            </div>
            <div className="mt-10 grid max-w-xl gap-3 md:grid-cols-3">
              {[
                ["Entrega", "24h uteis"],
                ["Pagamento", "pedido via API"],
                ["Estoque", "atualizado"],
              ].map(([title, detail]) => (
                <div className="rounded-2xl border border-white/10 bg-background/70 p-4 backdrop-blur" key={title}>
                  <strong className="block text-base text-foreground">{title}</strong>
                  <span className="text-sm text-muted">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="mb-10 flex items-center gap-4 text-2xl font-bold md:text-3xl">
          <span className="font-mono text-xl text-primary">01.</span>
          Mais vendidos da semana
          <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
