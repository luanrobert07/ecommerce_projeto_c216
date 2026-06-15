import Link from "next/link";

export function SiteHeader() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/catalogo", label: "Catalogo" },
    { href: "/carrinho", label: "Carrinho" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/86 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link className="text-xl font-bold" href="/">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            &lt;
          </span>
          StackStore
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {" "}
            /&gt;
          </span>
        </Link>
        <div className="flex items-center gap-3 text-sm text-muted md:gap-7">
          {links.map((link) => (
            <Link
              className="transition-colors hover:text-primary"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
