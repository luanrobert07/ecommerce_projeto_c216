import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  Min,
  ValidateNested,
} from "class-validator";
import { CreateCustomerDto } from "../customers/dto";
import type { OrderStatus } from "./order.entity";

export class CreateOrderItemDto {
  @ApiProperty({
    example: 1,
    description: "ID do produto comprado. Exemplo: 1 = Teclado Flux Pro.",
  })
  @IsInt()
  productId: number;

  @ApiProperty({
    example: 2,
    minimum: 1,
    description: "Quantidade do produto nesse pedido.",
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: {
      name: "Ana Martins",
      email: "ana.martins@stackstore.com",
      phone: "35999990000",
    },
    description:
      "Dados do cliente. Se o email ja existir, o pedido e vinculado ao cliente existente.",
  })
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  customer: CreateCustomerDto;

  @ApiProperty({
    type: () => [CreateOrderItemDto],
    example: [
      { productId: 1, quantity: 1 },
      { productId: 3, quantity: 1 },
    ],
    description:
      "Lista de itens comprados. A API calcula o total e reduz o estoque automaticamente.",
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: ["pending", "paid", "shipped", "cancelled"],
    example: "paid",
    description:
      "Novo status do pedido: pending, paid, shipped ou cancelled.",
  })
  @IsIn(["pending", "paid", "shipped", "cancelled"])
  status: OrderStatus;
}
