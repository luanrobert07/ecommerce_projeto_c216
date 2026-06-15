import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
  @ApiProperty({
    example: "Ana Martins",
    description: "Nome do cliente informado no checkout.",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "ana.martins@stackstore.com",
    description: "Email usado para localizar ou cadastrar o cliente.",
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: "35999990000",
    description: "Telefone opcional do cliente.",
  })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
