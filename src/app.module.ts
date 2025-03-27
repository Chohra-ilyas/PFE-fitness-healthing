import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Trainer } from './trainers/entities/trainer.entity';
import { TrainerModule } from './trainers/trainer.module';
import { Trainee } from './trainees/entities/trainee.entity';
import { TraineeModule } from './trainees/trainee.module';
import { Review } from './reviews/entities/reviews.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { CurrentStateModule } from './current-states/currentState.module';
import { CurrentState } from './current-states/entities/currentState.entity';
import { WorkoutModule } from './workout/workout.module';
import { Exercise } from './exercises/entities/exercises.entity';
import { DaysModule } from './days/days.module';
import { ExercisesModule } from './exercises/exercises.module';
import { Day } from './days/entities/days.entity';
import { Workout } from './workout/entities/workout.entity';
import { NutritionModule } from './nutrition/nutrition.module';
import { NotRecommendedFoodModule } from './notRecommended_food/notRecommended_food.module';
import { RecommendedFoodModule } from './recommended_food/recommended_food.module';
import { Nutrition } from './nutrition/entities/nutrition.entity';
import { NotRecommendedFood } from './notRecommended_food/entities/notRecommended_food.entity';
import { RecommendedFood } from './recommended_food/entities/recommended_food.entity';
import { OpenaiModule } from './openai/openai.module';
import { ChronicDiseasesModule } from './chronic-diseases/chronic-diseases.module';
import { TraineeChronicDiseaseModule } from './trainee-chronic-diseases/trainee-chronic-disease.module';
import { TraineeChronicDisease } from './trainee-chronic-diseases/entities/Trainee-chronic-disease.entity';
import { ChronicDisease } from './chronic-diseases/entities/chronic-diseases.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [
            User,
            Trainer,
            Trainee,
            Review,
            CurrentState,
            Exercise,
            Day,
            Workout,
            Nutrition,
            NotRecommendedFood,
            RecommendedFood,
            TraineeChronicDisease,
            ChronicDisease
          ],
          synchronize: process.env.NODE_ENV === 'development', // set to false in production
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UsersModule,
    TrainerModule,
    TraineeModule,
    ReviewsModule,
    CurrentStateModule,
    WorkoutModule,
    DaysModule,
    ExercisesModule,
    NutritionModule,
    NotRecommendedFoodModule,
    RecommendedFoodModule,
    OpenaiModule,
    ChronicDiseasesModule,
    TraineeChronicDiseaseModule,
    CloudinaryModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}