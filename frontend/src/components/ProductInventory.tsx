"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/lib/api";
import { deleteProduct, updateProduct } from "@/lib/api";
import { getProductImage } from "@/lib/catalog";

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ProductInventory({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Excluir "${product.name}" do catalogo e do estoque?`,
    );

    if (!confirmed) return;

    setMessage("");
    setDeletingId(product.id);

    try {
      await deleteProduct(product.id);
      setMessage("Produto excluido com sucesso.");
      router.refresh();
    } catch {
      setMessage(
        "Nao foi possivel excluir. Se o produto ja apareceu em algum pedido, mantenha-o para preservar o historico.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleUpdate(
    event: FormEvent<HTMLFormElement>,
    product: Product,
  ) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const imageFile = form.get("image") as File | null;
    const imageUrl =
      imageFile && imageFile.size > 0
        ? await readImageAsDataUrl(imageFile)
        : product.imageUrl;

    setMessage("");
    setSavingId(product.id);

    try {
      await updateProduct(product.id, {
        name: String(form.get("name")),
        description: String(form.get("description")),
        price: Number(form.get("price")),
        stock: Number(form.get("stock")),
        imageUrl,
        categoryId: Number(form.get("categoryId")),
      });
      setEditingId(null);
      setImagePreview("");
      setMessage("Produto atualizado com sucesso.");
      router.refresh();
    } catch {
      setMessage("Nao foi possivel editar. Confira os campos e tente novamente.");
    } finally {
      setSavingId(null);
    }
  }

  function startEditing(product: Product) {
    setEditingId(product.id);
    setImagePreview(getProductImage(product));
    setMessage("");
  }

  return (
    <div className="panel rounded-[2rem] p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Estoque</h2>
        {message && <p className="text-sm text-primary">{message}</p>}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {products.length === 0 ? (
          <p className="text-sm text-muted">Nenhum produto cadastrado ainda.</p>
        ) : (
          products.map((product) => {
            const image = getProductImage(product);
            const isEditing = editingId === product.id;

            return (
              <div
                className="rounded-xl border border-white/10 bg-background/50 p-3"
                key={product.id}
              >
                <div className="grid grid-cols-[56px_1fr_auto] items-center gap-3">
                  <div className="relative h-12 overflow-hidden rounded-lg border border-white/10 bg-slate-950">
                    <Image
                      alt={`Miniatura de estoque ${product.name}`}
                      className="object-cover"
                      fill
                      sizes="56px"
                      src={image}
                      unoptimized={image.startsWith("data:")}
                    />
                  </div>
                  <span>
                    <strong className="block text-sm">{product.name}</strong>
                    <span className="text-xs text-muted">
                      {product.category.name} - {product.stock} un.
                    </span>
                  </span>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      className="rounded-lg border border-primary/50 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                      onClick={() =>
                        isEditing ? setEditingId(null) : startEditing(product)
                      }
                      type="button"
                    >
                      {isEditing ? "Cancelar" : "Editar"}
                    </button>
                    <button
                      className="rounded-lg border border-red-400/40 px-3 py-2 text-xs font-semibold text-red-200 transition-colors hover:border-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product)}
                      type="button"
                    >
                      {deletingId === product.id ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <form
                    className="mt-4 grid gap-3 border-t border-border pt-4"
                    onSubmit={(event) => handleUpdate(event, product)}
                  >
                    <input
                      className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none focus:border-primary"
                      defaultValue={product.name}
                      name="name"
                      placeholder="Nome do produto"
                      required
                    />
                    <textarea
                      className="min-h-24 rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none focus:border-primary"
                      defaultValue={product.description}
                      name="description"
                      placeholder="Descricao"
                      required
                    />
                    <div className="grid gap-3 md:grid-cols-3">
                      <input
                        className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none focus:border-primary"
                        defaultValue={Number(product.price)}
                        min="0"
                        name="price"
                        placeholder="Preco"
                        required
                        step="0.01"
                        type="number"
                      />
                      <input
                        className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none focus:border-primary"
                        defaultValue={product.stock}
                        min="0"
                        name="stock"
                        placeholder="Estoque"
                        required
                        type="number"
                      />
                      <select
                        className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm outline-none focus:border-primary"
                        defaultValue={product.category.id}
                        name="categoryId"
                        required
                      >
                        {categories.map((category) => (
                          <option
                            className="bg-background"
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <label className="rounded-xl border border-dashed border-border bg-background/70 px-4 py-4 text-sm text-muted">
                      <span className="block font-medium text-foreground">
                        Trocar imagem
                      </span>
                      <input
                        accept="image/*"
                        className="mt-3 block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-slate-950"
                        name="image"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0];
                          if (!file) {
                            setImagePreview(getProductImage(product));
                            return;
                          }
                          readImageAsDataUrl(file)
                            .then(setImagePreview)
                            .catch(() => setImagePreview(getProductImage(product)));
                        }}
                        type="file"
                      />
                    </label>
                    {imagePreview && (
                      <div
                        aria-label="Previa da imagem do produto"
                        className="h-32 rounded-xl border border-white/10 bg-cover bg-center"
                        style={{ backgroundImage: `url(${imagePreview})` }}
                      />
                    )}
                    <button
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
                      disabled={savingId === product.id || categories.length === 0}
                      type="submit"
                    >
                      {savingId === product.id ? "Salvando..." : "Salvar alteracoes"}
                    </button>
                  </form>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
