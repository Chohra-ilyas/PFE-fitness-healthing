import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendedFood } from './entities/recommended_food.entity';

@Injectable()
export class RecommendedFoodService {
  constructor(
    @InjectRepository(RecommendedFood)
    private readonly recommendedFoodRepository: Repository<RecommendedFood>,
  ) {}
}
