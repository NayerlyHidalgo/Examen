import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './review.entity';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() data: Partial<Review>) {
    return this.reviewService.create(data);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('product/:productoId')
  findByProduct(@Param('productoId') productoId: string) {
    return this.reviewService.findByProduct(productoId);
  }

  @Get('user/:usuarioId')
  findByUser(@Param('usuarioId') usuarioId: string) {
    return this.reviewService.findByUser(usuarioId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
