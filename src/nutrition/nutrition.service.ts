import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nutrition } from './entities/nutrition.entity';

@Injectable()
export class NutritionService {
  constructor(
    @InjectRepository(Nutrition)
    private readonly nutritionRepository: Repository<Nutrition>,
  ) {}

  
}
