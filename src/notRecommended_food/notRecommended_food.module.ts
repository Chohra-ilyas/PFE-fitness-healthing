import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotRecommendedFood } from './entities/notRecommended_food.entity';
import { NotRecommendedFoodService } from './notRecommended_food.service';
import { NotRecommendedFoodController } from './notRecommended_food.controller';
import { NutritionModule } from 'src/nutrition/nutrition.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotRecommendedFood]),
    forwardRef(() => NutritionModule),
    UsersModule,
    JwtModule,
  ],
  controllers: [NotRecommendedFoodController],
  providers: [NotRecommendedFoodService],
  exports: [NotRecommendedFoodService],
})
export class NotRecommendedFoodModule {}
