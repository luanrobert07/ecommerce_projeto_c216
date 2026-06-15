import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "../categories/category.entity";
import { Product } from "../products/product.entity";

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    const count = await this.productsRepository.count();
    if (count > 0) return;

    const categories = await this.categoriesRepository.save([
      { name: "Perifericos", description: "Itens para produtividade e setup." },
      { name: "Hardware", description: "Componentes para maquinas modernas." },
      { name: "Software", description: "Licencas e kits digitais." },
    ]);

    await this.productsRepository.save([
      {
        name: "Teclado Flux Pro",
        description: "Teclado mecanico compacto com iluminacao e switches tateis.",
        price: 389.9,
        stock: 18,
        imageUrl: "KBD",
        category: categories[0],
      },
      {
        name: "Mouse Vector X",
        description: "Sensor preciso, baixa latencia e ergonomia para uso diario.",
        price: 219.9,
        stock: 24,
        imageUrl: "MSE",
        category: categories[0],
      },
      {
        name: "SSD Nebula 1TB",
        description: "Armazenamento NVMe para builds rapidas e confiaveis.",
        price: 529.9,
        stock: 12,
        imageUrl: "SSD",
        category: categories[1],
      },
      {
        name: "Kit DevOps Essencial",
        description: "Pacote digital com templates, checklists e guias de deploy.",
        price: 149.9,
        stock: 50,
        imageUrl: "KIT",
        category: categories[2],
      },
    ]);

    this.logger.log("Seed inicial criado com categorias e produtos.");
  }
}
