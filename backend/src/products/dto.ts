import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    example: "Teclado Flux Pro",
    description: "Nome comercial do produto exibido no catalogo.",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "Teclado mecanico compacto com iluminacao e switches tateis.",
    description: "Descricao curta usada nas telas do catalogo e administracao.",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 389.9,
    minimum: 0,
    description: "Preco em reais.",
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 18,
    minimum: 0,
    description: "Quantidade disponivel em estoque.",
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    example: "/images/teclado-flux-pro.png",
    description:
      "URL publica, caminho em /public ou data URL base64 enviada pelo Admin.",
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: 1,
    description: "ID da categoria existente. Exemplo: 1 = Perifericos.",
  })
  @IsInt()
  categoryId: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
