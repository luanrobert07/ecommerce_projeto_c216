import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "./customer.entity";
import { CreateCustomerDto, UpdateCustomerDto } from "./dto";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {}

  findAll() {
    return this.repository.find({ order: { id: "ASC" } });
  }

  async findOne(id: number) {
    const customer = await this.repository.findOne({ where: { id } });
    if (!customer) throw new NotFoundException("Cliente nao encontrado.");
    return customer;
  }

  async findOrCreate(dto: CreateCustomerDto) {
    const existing = await this.repository.findOne({ where: { email: dto.email } });
    if (existing) return existing;
    return this.repository.save(this.repository.create(dto));
  }

  create(dto: CreateCustomerDto) {
    return this.repository.save(this.repository.create(dto));
  }

  async update(id: number, dto: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    Object.assign(customer, dto);
    return this.repository.save(customer);
  }

  async remove(id: number) {
    const customer = await this.findOne(id);
    await this.repository.remove(customer);
    return { deleted: true };
  }
}
