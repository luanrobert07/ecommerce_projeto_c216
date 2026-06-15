import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Request, Response, json, urlencoded } from "express";
import { AppModule } from "./app.module";
import { FileLogger } from "./logger/file-logger";

async function bootstrap() {
  const logger = new FileLogger();
  const app = await NestFactory.create(AppModule, { logger });
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: true, limit: "10mb" }));
  app.use((request: Request, response: Response, next: () => void) => {
    const startedAt = Date.now();

    response.on("finish", () => {
      const duration = Date.now() - startedAt;
      logger.log(
        `${request.method} ${request.originalUrl} ${response.statusCode} ${duration}ms`,
        "HTTP",
      );
    });

    next();
  });
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("StackStore API")
    .setDescription("API REST do e-commerce StackStore para o Projeto Final C216.")
    .setVersion("1.0")
    .addTag("products", "Produtos do catalogo")
    .addTag("categories", "Categorias dos produtos")
    .addTag("customers", "Clientes da loja")
    .addTag("orders", "Pedidos e itens comprados")
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, swaggerDocument, {
    jsonDocumentUrl: "docs-json",
  });

  await app.listen(process.env.PORT ?? 3001);
  logger.log(`API running on port ${process.env.PORT ?? 3001}`, "Bootstrap");
}

bootstrap();
