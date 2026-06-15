"use client";

import { FormEvent, ReactNode, useState } from "react";

const ADMIN_SESSION_KEY = "stackstore-admin-auth";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123";

export function AdminGate({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true",
  );
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));

    if (password !== ADMIN_PASSWORD) {
      setError("Senha incorreta.");
      return;
    }

    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    setError("");
    setIsAuthenticated(true);
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl items-center px-6 py-16">
      <form className="panel mx-auto w-full max-w-md rounded-[2rem] p-6" onSubmit={handleSubmit}>
        <p className="font-mono text-sm text-primary">Area restrita</p>
        <h1 className="mt-3 text-3xl font-bold">Acesso administrativo</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Informe a senha para gerenciar produtos, estoque e pedidos da loja.
        </p>
        <input
          className="mt-6 w-full rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
          name="password"
          placeholder="Senha do admin"
          required
          type="password"
        />
        <button
          className="mt-4 w-full rounded-xl bg-primary px-5 py-4 font-semibold text-slate-950"
          type="submit"
        >
          Entrar no Admin
        </button>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <p className="mt-5 text-xs text-muted">
          Senha padrao para demonstracao: <span className="font-mono text-primary">admin123</span>
        </p>
      </form>
    </section>
  );
}
