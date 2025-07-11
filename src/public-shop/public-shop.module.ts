import { Module } from '@nestjs/common';
import { PublicShopController } from './public-shop.controller';
import { ProductsModule } from '../products/products.module';
import { CategoriesModule } from '../categories/categories.module';
import { OrdenModule } from '../orden/orden.module';

@Module({
  imports: [ProductsModule, CategoriesModule, OrdenModule],
  controllers: [PublicShopController],
})
export class PublicShopModule {}
