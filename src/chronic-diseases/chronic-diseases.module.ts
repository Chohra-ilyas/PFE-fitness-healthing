import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChronicDisease } from './entities/chronic-diseases.entity';
import { ChronicDiseasesController } from './chronic-diseases.controller';
import { ChronicDiseasesService } from './chronic-diseases.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ChronicDisease]),
    ],
    controllers: [ChronicDiseasesController],
    providers: [ChronicDiseasesService],
    exports: [ChronicDiseasesService],
})
export class ChronicDiseasesModule {}
