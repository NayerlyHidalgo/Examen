import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [ProductsModule, CategoriesModule],
  controllers: [ShopController],
})
export class ShopModule {}
