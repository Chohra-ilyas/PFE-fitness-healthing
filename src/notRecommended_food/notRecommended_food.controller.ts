import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { NotRecommendedFoodService } from './notRecommended_food.service';

@Controller('not-recommended-food')
export class NotRecommendedFoodController {
  constructor(private readonly notRecommendedFoodService: NotRecommendedFoodService) {}

}
