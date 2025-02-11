import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendedFood } from './entities/recommended_food.entity';
import { RecommendedFoodService } from './recommended_food.service';
import { RecommendedFoodController } from './recommended_food.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendedFood])],
  controllers: [RecommendedFoodController],
  providers: [RecommendedFoodService],
})
export class RecommendedFoodModule {}
