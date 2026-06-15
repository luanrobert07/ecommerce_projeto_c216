import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  findAll() {
    return this.repository.find({ order: { id: "ASC" } });
  }

  async findOne(id: number) {
    const category = await this.repository.findOne({ where: { id } });
    if (!category) throw new NotFoundException("Categoria nao encontrada.");
    return category;
  }

  create(dto: CreateCategoryDto) {
    return this.repository.save(this.repository.create(dto));
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    return this.repository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.repository.remove(category);
    return { deleted: true };
  }
}
