import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesModule } from "./categories/categories.module";
import { Category } from "./categories/category.entity";
import { CustomersModule } from "./customers/customers.module";
import { Customer } from "./customers/customer.entity";
import { SeedService } from "./database/seed.service";
import { HealthController } from "./health.controller";
import { OrderItem } from "./orders/order-item.entity";
import { Order } from "./orders/order.entity";
import { OrdersModule } from "./orders/orders.module";
import { Product } from "./products/product.entity";
import { ProductsModule } from "./products/products.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("DB_HOST", "localhost"),
        port: config.get("DB_PORT", 5432),
        username: config.get("DB_USER", "postgres"),
        password: config.get("DB_PASSWORD", "postgres"),
        database: config.get("DB_NAME", "stackstore"),
        entities: [Category, Product, Customer, Order, OrderItem],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Category, Product]),
    CategoriesModule,
    ProductsModule,
    CustomersModule,
    OrdersModule,
  ],
  controllers: [HealthController],
  providers: [SeedService],
})
export class AppModule {}
