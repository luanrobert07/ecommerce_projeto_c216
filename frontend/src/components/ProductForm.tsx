"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/api";
import { createProduct } from "@/lib/api";

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const imageFile = form.get("image") as File | null;
    const imageUrl =
      imageFile && imageFile.size > 0
        ? await readImageAsDataUrl(imageFile)
        : "SKU";

    const payload = {
      name: String(form.get("name")),
      description: String(form.get("description")),
      price: Number(form.get("price")),
      stock: Number(form.get("stock")),
      imageUrl,
      categoryId: Number(form.get("categoryId")),
    };

    try {
      await createProduct(payload);
      formElement.reset();
      setImagePreview("");
      setMessage("Produto cadastrado com sucesso.");
      router.refresh();
    } catch {
      setMessage("Nao foi possivel cadastrar. Confira se a API esta rodando.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel rounded-[2rem] p-6" onSubmit={handleSubmit}>
      <div className="mb-6">
        <p className="font-mono text-sm text-primary">Cadastro</p>
        <h2 className="mt-2 text-2xl font-semibold">Adicionar produto</h2>
      </div>
      <div className="grid gap-4">
        <input
          className="rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
          name="name"
          placeholder="Nome do produto"
          required
        />
        <textarea
          className="min-h-28 rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
          name="description"
          placeholder="Descricao do produto"
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
            min="0"
            name="price"
            placeholder="Preco"
            required
            step="0.01"
            type="number"
          />
          <input
            className="rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
            min="0"
            name="stock"
            placeholder="Estoque"
            required
            type="number"
          />
        </div>
        <select
          className="rounded-xl border border-border bg-background/70 px-4 py-3 outline-none focus:border-primary"
          name="categoryId"
          required
        >
          <option value="">Categoria</option>
          {categories.map((category) => (
            <option className="bg-background" key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <label className="rounded-xl border border-dashed border-border bg-background/70 px-4 py-4 text-sm text-muted">
          <span className="block font-medium text-foreground">Imagem do produto</span>
          <span className="mt-1 block text-xs">
            Selecione uma imagem do seu computador para aparecer no catálogo.
          </span>
          <input
            accept="image/*"
            className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-slate-950"
            name="image"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (!file) {
                setImagePreview("");
                return;
              }
              readImageAsDataUrl(file).then(setImagePreview).catch(() => setImagePreview(""));
            }}
            type="file"
          />
        </label>
        {imagePreview && (
          <div
            aria-label="Previa da imagem selecionada"
            className="h-40 rounded-xl border border-white/10 bg-cover bg-center"
            style={{ backgroundImage: `url(${imagePreview})` }}
          />
        )}
      </div>
      <button
        className="mt-6 w-full rounded-xl bg-primary px-5 py-4 font-semibold text-slate-950 disabled:opacity-50"
        disabled={isSubmitting || categories.length === 0}
        type="submit"
      >
        {isSubmitting ? "Salvando..." : "Cadastrar produto"}
      </button>
      {message && <p className="mt-4 text-sm text-primary">{message}</p>}
    </form>
  );
}
