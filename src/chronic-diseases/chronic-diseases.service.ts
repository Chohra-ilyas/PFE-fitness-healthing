import { Injectable } from '@nestjs/common';
import { ChronicDisease } from './entities/chronic-diseases.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChronicDiseasesService {
  constructor(
    @InjectRepository(ChronicDisease)
    private readonly chronicDiseasesRepository: Repository<ChronicDisease>,
  ) {}

  public async createChronicDisease(chronicDiseaseName: string) : Promise<ChronicDisease> {
    const Disease = await this.chronicDiseasesRepository.findOneBy({
        chronicDiseaseName,
    })
    if (Disease) {
        return Disease;
    }
    const chronicDisease = await this.chronicDiseasesRepository.create({
      chronicDiseaseName,
    });
    return await this.chronicDiseasesRepository.save(chronicDisease);
  }
}
