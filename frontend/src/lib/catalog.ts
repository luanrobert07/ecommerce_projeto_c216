import type { Product } from "@/lib/api";

export const productImages: Record<string, string> = {
  "Teclado Flux Pro": "/images/teclado-flux-pro.png",
  "Mouse Vector X": "/images/mouse-vector-x.png",
  "SSD Nebula 1TB": "/images/ssd-nebula-1tb.png",
  "Kit DevOps Essencial": "/images/kit-devops-essencial.png",
};

export const productSpecs: Record<string, string[]> = {
  "Teclado Flux Pro": ["Layout 75%", "Switches tateis", "USB-C removivel"],
  "Mouse Vector X": ["2.4GHz wireless", "6 botoes", "Sensor 12K DPI"],
  "SSD Nebula 1TB": ["NVMe PCIe", "1TB", "Dissipador slim"],
  "Kit DevOps Essencial": ["Templates", "Checklists", "Fluxos Docker"],
};

export const productUseCases: Record<string, string> = {
  "Teclado Flux Pro": "Para quem passa o dia codando e precisa de resposta firme sem ocupar a mesa toda.",
  "Mouse Vector X": "Controle preciso para trabalho, estudo, design e longas sessoes de produtividade.",
  "SSD Nebula 1TB": "Upgrade direto para projetos pesados, containers e ambientes locais mais rapidos.",
  "Kit DevOps Essencial": "Material digital para organizar deploys, logs, ambientes e documentacao tecnica.",
};

export function getProductImage(product: Pick<Product, "name" | "imageUrl">) {
  if (productImages[product.name]) return productImages[product.name];
  if (
    product.imageUrl?.startsWith("/") ||
    product.imageUrl?.startsWith("data:") ||
    product.imageUrl?.startsWith("http")
  ) {
    return product.imageUrl;
  }
  return "/images/hero-stackstore.png";
}

export function getProductSpecs(productName: string) {
  return productSpecs[productName] ?? ["Pronto envio", "Garantia", "Suporte"];
}

export function getProductUseCase(productName: string) {
  return productUseCases[productName] ?? "Produto selecionado para setups modernos e rotina tecnica.";
}
