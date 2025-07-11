import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
  ) {}

  async create(data: Partial<Review>): Promise<Review> {
    const review = this.reviewRepo.create(data);
    return this.reviewRepo.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepo.find();
  }

  async findByProduct(productoId: string): Promise<Review[]> {
    return this.reviewRepo.find({ where: { productoId } });
  }

  async findByUser(usuarioId: string): Promise<Review[]> {
    return this.reviewRepo.find({ where: { usuario: { id: usuarioId } } });
  }

  async remove(id: string): Promise<Review | null> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) return null;
    await this.reviewRepo.remove(review);
    return review;
  }
}
