import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { RecommendedFoodService } from './recommended_food.service';

@Controller('recommended-food')
export class RecommendedFoodController {
  constructor(private readonly recommendedFoodService: RecommendedFoodService) {}

}
