import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { CategoriesController } from "../src/categories/categories.controller";
import { CategoriesService } from "../src/categories/categories.service";
import { CustomersController } from "../src/customers/customers.controller";
import { CustomersService } from "../src/customers/customers.service";
import { OrdersController } from "../src/orders/orders.controller";
import { OrdersService } from "../src/orders/orders.service";
import { ProductsController } from "../src/products/products.controller";
import { ProductsService } from "../src/products/products.service";

describe("StackStore API (e2e)", () => {
  let app: INestApplication;

  const category = {
    id: 1,
    name: "Perifericos",
    description: "Itens para produtividade e setup.",
  };

  const product = {
    id: 1,
    name: "Teclado Flux Pro",
    description: "Teclado mecanico compacto.",
    price: 389.9,
    stock: 10,
    imageUrl: "KBD",
    category,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        ProductsController,
        CategoriesController,
        CustomersController,
        OrdersController,
      ],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([product]),
            findOne: jest.fn().mockResolvedValue(product),
            create: jest.fn().mockImplementation((dto) =>
              Promise.resolve({
                id: 2,
                ...dto,
                category,
              }),
            ),
            update: jest.fn().mockImplementation((id, dto) =>
              Promise.resolve({
                ...product,
                id,
                ...dto,
              }),
            ),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([category]),
            findOne: jest.fn().mockResolvedValue(category),
            create: jest.fn().mockImplementation((dto) =>
              Promise.resolve({
                id: 2,
                ...dto,
              }),
            ),
            update: jest.fn().mockImplementation((id, dto) =>
              Promise.resolve({
                ...category,
                id,
                ...dto,
              }),
            ),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
        {
          provide: CustomersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              name: "Cliente Demo",
              email: "cliente@stackstore.com",
            }),
            create: jest.fn().mockImplementation((dto) =>
              Promise.resolve({
                id: 1,
                ...dto,
              }),
            ),
            update: jest.fn().mockImplementation((id, dto) =>
              Promise.resolve({
                id,
                ...dto,
              }),
            ),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
        {
          provide: OrdersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              status: "pending",
              total: 389.9,
              customer: {
                id: 1,
                name: "Cliente Demo",
                email: "cliente@stackstore.com",
              },
              items: [],
            }),
            create: jest.fn().mockResolvedValue({
              id: 1,
              status: "pending",
              total: 389.9,
              customer: {
                id: 1,
                name: "Cliente Demo",
                email: "cliente@stackstore.com",
              },
              items: [{ id: 1, quantity: 1, unitPrice: 389.9, product }],
            }),
            updateStatus: jest.fn().mockImplementation((id, dto) =>
              Promise.resolve({
                id,
                status: dto.status,
                total: 389.9,
                items: [],
              }),
            ),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /products returns products", async () => {
    await request(app.getHttpServer())
      .get("/products")
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe("Teclado Flux Pro");
      });
  });

  it("POST /categories creates a category", async () => {
    await request(app.getHttpServer())
      .post("/categories")
      .send({
        name: "Audio",
        description: "Headsets e acessorios de audio.",
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBe(2);
        expect(body.name).toBe("Audio");
      });
  });

  it("POST /orders creates an order", async () => {
    await request(app.getHttpServer())
      .post("/orders")
      .send({
        customer: {
          name: "Cliente Demo",
          email: "cliente@stackstore.com",
        },
        items: [{ productId: 1, quantity: 1 }],
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.id).toBe(1);
        expect(body.status).toBe("pending");
      });
  });

  it("PUT /orders/:id/status updates order status", async () => {
    await request(app.getHttpServer())
      .put("/orders/1/status")
      .send({ status: "paid" })
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe("paid");
      });
  });
});
