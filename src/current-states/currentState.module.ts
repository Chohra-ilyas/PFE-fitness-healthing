import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentState } from './entities/currentState.entity';
import { CurrentStateService } from './currentState.service';
import { CurrentStateController } from './currentState.controller';
import { UsersModule } from 'src/users/users.module';
import { TraineeModule } from 'src/trainees/trainee.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([CurrentState]),
    UsersModule,
    TraineeModule,
    JwtModule,
  ],
  controllers: [CurrentStateController],
  providers: [CurrentStateService],
})
export class CurrentStateModule {}
