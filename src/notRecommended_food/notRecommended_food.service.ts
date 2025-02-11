import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotRecommendedFood } from './entities/notRecommended_food.entity';

@Injectable()
export class NotRecommendedFoodService {
  constructor(
    @InjectRepository(NotRecommendedFood)
    private readonly notRecommendedFoodRepository: Repository<NotRecommendedFood>,
  ) {}

}
