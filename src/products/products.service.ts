import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Product } from './products.entity';

interface ShopFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  exclude?: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: Partial<Product>): Promise<Product | null> {
    try {
      const product = this.productRepo.create(dto);
      return await this.productRepo.save(product);
    } catch (err) {
      console.error('Error creating product:', err);
      return null;
    }
  }

  async findAll(filters?: ShopFilters): Promise<{ data: Product[]; total: number }> {
    try {
      const query = this.productRepo.createQueryBuilder('product')
        .leftJoinAndSelect('product.categoria', 'categoria')
        .where('product.disponible = :disponible', { disponible: true });

      // Aplicar filtros
      if (filters?.category) {
        query.andWhere('categoria.id = :categoryId', { categoryId: filters.category });
      }

      if (filters?.search) {
        query.andWhere(
          '(product.nombre ILIKE :search OR product.descripcion ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }

      if (filters?.featured) {
        query.andWhere('product.destacado = :featured', { featured: true });
      }

      if (filters?.exclude) {
        query.andWhere('product.id != :excludeId', { excludeId: filters.exclude });
      }

      // Ordenar por destacado primero, luego por nombre
      query.orderBy('product.destacado', 'DESC')
        .addOrderBy('product.nombre', 'ASC');

      // Paginación
      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      const skip = (page - 1) * limit;

      query.skip(skip).take(limit);

      const [data, total] = await query.getManyAndCount();

      return { data, total };
    } catch (err) {
      console.error('Error retrieving products:', err);
      return { data: [], total: 0 };
    }
  }

  async findOne(id: string | number): Promise<Product | null> {
    try {
      return await this.productRepo.findOne({ 
        where: { id: id.toString() },
        relations: ['categoria']
      });
    } catch (err) {
      console.error('Error finding product:', err);
      return null;
    }
  }

  async findByName(nombre: string): Promise<Product | null> {
    try {
      return await this.productRepo.findOne({ where: { nombre } });
    } catch (err) {
      console.error('Error finding product by name:', err);
      return null;
    }
  }

  async findFeatured(limit: number = 4): Promise<Product[]> {
    try {
      return await this.productRepo.find({
        where: { destacado: true, disponible: true },
        relations: ['categoria'],
        take: limit,
        order: { nombre: 'ASC' }
      });
    } catch (err) {
      console.error('Error finding featured products:', err);
      return [];
    }
  }

  async findByCategory(categoryId: string, limit?: number): Promise<Product[]> {
    try {
      const query = this.productRepo.createQueryBuilder('product')
        .leftJoinAndSelect('product.categoria', 'categoria')
        .where('categoria.id = :categoryId', { categoryId })
        .andWhere('product.disponible = :disponible', { disponible: true })
        .orderBy('product.nombre', 'ASC');

      if (limit) {
        query.take(limit);
      }

      return await query.getMany();
    } catch (err) {
      console.error('Error finding products by category:', err);
      return [];
    }
  }

  async update(id: string, dto: Partial<Product>): Promise<Product | null> {
    try {
      const product = await this.findOne(id);
      if (!product) return null;

      Object.assign(product, dto);
      return await this.productRepo.save(product);
    } catch (err) {
      console.error('Error updating product:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Product | null> {
    try {
      const product = await this.findOne(id);
      if (!product) return null;

      await this.productRepo.remove(product);
      return product;
    } catch (err) {
      console.error('Error deleting product:', err);
      return null;
    }
  }
}
