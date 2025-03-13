import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TraineeModule } from 'src/trainees/trainee.module';
import { UsersModule } from 'src/users/users.module';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';

@Module({
  imports: [TraineeModule, UsersModule, JwtModule],
  controllers: [OpenaiController],
  providers: [OpenaiService],
})
export class OpenaiModule {}
