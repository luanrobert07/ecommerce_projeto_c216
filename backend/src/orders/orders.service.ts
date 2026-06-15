import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CustomersService } from "../customers/customers.service";
import { ProductsService } from "../products/products.service";
import { CreateOrderDto, UpdateOrderStatusDto } from "./dto";
import { OrderItem } from "./order-item.entity";
import { Order } from "./order.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    private readonly customersService: CustomersService,
    private readonly productsService: ProductsService,
  ) {}

  findAll() {
    return this.repository.find({ order: { id: "DESC" } });
  }

  async findOne(id: number) {
    const order = await this.repository.findOne({ where: { id } });
    if (!order) throw new NotFoundException("Pedido nao encontrado.");
    return order;
  }

  async create(dto: CreateOrderDto) {
    const customer = await this.customersService.findOrCreate(dto.customer);
    const items: OrderItem[] = [];
    let total = 0;

    for (const item of dto.items) {
      const product = await this.productsService.findOne(item.productId);
      await this.productsService.decreaseStock(product, item.quantity);
      const unitPrice = Number(product.price);
      total += unitPrice * item.quantity;
      items.push(Object.assign(new OrderItem(), { product, quantity: item.quantity, unitPrice }));
    }

    const order = this.repository.create({ customer, items, total });
    return this.repository.save(order);
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);
    order.status = dto.status;
    return this.repository.save(order);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    await this.repository.remove(order);
    return { deleted: true };
  }
}
