import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { Trainer } from './entities/trainer.entity';
import { TrainerService } from './trainer.service';
import { TrainerController } from './trainer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trainer]), UsersModule, JwtModule],
  controllers: [TrainerController],
  providers: [TrainerService],
  exports: [TrainerService],
})
export class TrainerModule {}
