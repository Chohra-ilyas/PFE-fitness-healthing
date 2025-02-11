import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotRecommendedFood } from './entities/notRecommended_food.entity';
import { NotRecommendedFoodService } from './notRecommended_food.service';
import { NotRecommendedFoodController } from './notRecommended_food.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotRecommendedFood])],
  controllers: [NotRecommendedFoodController],
  providers: [NotRecommendedFoodService],
})
export class NotRecommendedFoodModule {}
