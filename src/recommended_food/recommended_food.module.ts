import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendedFood } from './entities/recommended_food.entity';
import { RecommendedFoodService } from './recommended_food.service';
import { RecommendedFoodController } from './recommended_food.controller';
import { NutritionModule } from 'src/nutrition/nutrition.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecommendedFood]),
    forwardRef(() => NutritionModule),
    UsersModule,
    JwtModule,
  ],
  controllers: [RecommendedFoodController],
  providers: [RecommendedFoodService],
  exports: [RecommendedFoodService],
})
export class RecommendedFoodModule {}
