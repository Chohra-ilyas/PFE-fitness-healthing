import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/reviews.entity';
import { TrainerModule } from 'src/trainers/trainer.module';
import { TraineeModule } from 'src/trainees/trainee.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    TrainerModule,
    TraineeModule,
    UsersModule,
    JwtModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
