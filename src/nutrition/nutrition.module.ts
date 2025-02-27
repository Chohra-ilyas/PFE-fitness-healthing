import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nutrition } from './entities/nutrition.entity';
import { NutritionService } from './nutrition.service';
import { NutritionController } from './nutrition.controller';
import { TrainerModule } from 'src/trainers/trainer.module';
import { TraineeModule } from 'src/trainees/trainee.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { RecommendedFoodModule } from 'src/recommended_food/recommended_food.module';
import { NotRecommendedFoodModule } from 'src/notRecommended_food/notRecommended_food.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nutrition]),
    TrainerModule,
    TraineeModule,
    UsersModule,
    JwtModule,
    forwardRef(() => RecommendedFoodModule),
    forwardRef(() => NotRecommendedFoodModule),
  ],
  controllers: [NutritionController],
  providers: [NutritionService],
  exports: [NutritionService],
})
export class NutritionModule {}
