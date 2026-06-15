import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CategoriesService } from "../categories/categories.service";
import { Category } from "../categories/category.entity";
import { Product } from "./product.entity";
import { ProductsService } from "./products.service";

describe("ProductsService", () => {
  const category: Category = {
    id: 1,
    name: "Hardware",
    description: "Componentes",
    products: [],
  };

  const product: Product = {
    id: 1,
    name: "SSD",
    description: "Rapido",
    price: 100,
    stock: 5,
    imageUrl: "SSD",
    category,
    orderItems: [],
  };

  const repository = {
    find: jest.fn().mockResolvedValue([product]),
    findOne: jest.fn().mockResolvedValue(product),
    create: jest.fn((value) => value),
    save: jest.fn(async (value) => ({ id: 1, ...value })),
    remove: jest.fn().mockResolvedValue(product),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a product linked to a category", async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: repository },
        { provide: CategoriesService, useValue: { findOne: jest.fn().mockResolvedValue(category) } },
      ],
    }).compile();

    const service = moduleRef.get(ProductsService);
    const result = await service.create({
      name: "SSD",
      description: "Rapido",
      price: 100,
      stock: 5,
      imageUrl: "SSD",
      categoryId: 1,
    });

    expect(result.category).toEqual(category);
    expect(repository.save).toHaveBeenCalled();
  });

  it("decreases stock when there is inventory", async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: repository },
        { provide: CategoriesService, useValue: { findOne: jest.fn().mockResolvedValue(category) } },
      ],
    }).compile();

    const service = moduleRef.get(ProductsService);
    const result = await service.decreaseStock({ ...product }, 2);

    expect(result.stock).toBe(3);
    expect(repository.save).toHaveBeenCalled();
  });
});
