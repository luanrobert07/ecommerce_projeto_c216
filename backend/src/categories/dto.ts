import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    example: "Perifericos",
    description: "Nome da categoria exibida no catalogo e no Admin.",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @ApiProperty({
    example: "Itens para produtividade, mesa de trabalho e setup dev.",
    description: "Resumo curto para orientar a organizacao dos produtos.",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  description: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
