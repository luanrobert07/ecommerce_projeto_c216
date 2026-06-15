import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoriesService } from "../categories/categories.service";
import { CreateProductDto, UpdateProductDto } from "./dto";
import { Product } from "./product.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  findAll() {
    return this.repository.find({ order: { id: "ASC" } });
  }

  async findOne(id: number) {
    const product = await this.repository.findOne({ where: { id } });
    if (!product) throw new NotFoundException("Produto nao encontrado.");
    return product;
  }

  async create(dto: CreateProductDto) {
    const category = await this.categoriesService.findOne(dto.categoryId);
    return this.repository.save(this.repository.create({ ...dto, category }));
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    const category = dto.categoryId
      ? await this.categoriesService.findOne(dto.categoryId)
      : product.category;
    Object.assign(product, dto, { category });
    return this.repository.save(product);
  }

  async decreaseStock(product: Product, quantity: number) {
    if (product.stock < quantity) {
      throw new NotFoundException(`Estoque insuficiente para ${product.name}.`);
    }
    product.stock -= quantity;
    return this.repository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.repository.remove(product);
    return { deleted: true };
  }
}
