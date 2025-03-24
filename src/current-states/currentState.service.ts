import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentState } from './entities/currentState.entity';
import { Repository } from 'typeorm';
import { TraineeService } from 'src/trainees/trainee.service';
import { CreateCurrentStateDto } from './dtos/currentState.dto';
import { UpdateCurrentStateDto } from './dtos/updateCurrentState.dto';

@Injectable()
export class CurrentStateService {
  constructor(
    @InjectRepository(CurrentState)
    private readonly currentStateRepository: Repository<CurrentState>,
    private readonly traineeService: TraineeService,
  ) {}

  /**
   * Get the current state of a trainee
   * @param userTraineeId id of the logged in trainee
   * @returns current state of the trainee
   */
  public async getAllTraineeCurrentState(userTraineeId: number) {
    const { id } = await this.traineeService.getTraineeByUserId(userTraineeId);
    return this.currentStateRepository.find({
      where: { trainee: { id } },
      order: { createdAt: 'DESC' },
      relations: ['trainee'],
    });
  }

  /**
   * Add a new current state for a trainee
   * @param userTraineeId id of the trainee
   * @param currentState Data to create a new current state
   * @returns new current state
   */
  public async addNewCurrentState(
    userTraineeId: number,
    currentState: CreateCurrentStateDto,
  ) {
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    const allStates = await this.getAllTraineeCurrentState(userTraineeId);
    const date = new Date();
    const lastState = allStates[0];
    if (lastState) {
      const lastStateDate = new Date(lastState.createdAt);
      if (
        date.getFullYear() === lastStateDate.getFullYear() &&
        date.getMonth() === lastStateDate.getMonth() &&
        date.getDate() === lastStateDate.getDate()
      ) {
        throw new BadRequestException(
          'You have already added a current state today',
        );
      }
    }
    const newState = this.currentStateRepository.create({
      ...currentState,
      trainee,
    });
    const newCurrentState = await this.currentStateRepository.save(newState);
    return {
      id: newCurrentState.id,
      currentWeight: newCurrentState.currentWeight,
      currentHeight: newCurrentState.currentHeight,
      currentAge: newCurrentState.currentAge,
      createdAt: newCurrentState.createdAt,
      updatedAt: newCurrentState.updatedAt,
    };
  }

  public async getSingleCurrentState(
    userTraineeId: number,
    currentStateId: number,
  ) {
    const { id } = await this.traineeService.getTraineeByUserId(userTraineeId);
    const currentState = await this.currentStateRepository.findOne({
      where: { id: currentStateId, trainee: { id } },
      relations: ['trainee'],
    });
    if (!currentState) {
      throw new BadRequestException('Current state not found');
    }
    return currentState;
  }

  public async updateCurrentState(
    userTraineeId: number,
    currentStateId: number,
    currentState: UpdateCurrentStateDto,
  ) {
    const currentStateToUpdate = await this.currentStateRepository.findOne({
      where: { id: currentStateId },
      relations: ['trainee'],
    });
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    if (trainee.id !== currentStateToUpdate.trainee.id) {
      throw new ForbiddenException(
        'You are not allowed to update this current state',
      );
    }
    currentStateToUpdate.currentWeight =
      currentState.currentWeight ?? currentStateToUpdate.currentWeight;
    currentStateToUpdate.currentHeight =
      currentState.currentHeight ?? currentStateToUpdate.currentHeight;
    currentStateToUpdate.currentAge =
      currentState.currentAge ?? currentStateToUpdate.currentAge;
    await this.currentStateRepository.save(currentStateToUpdate);
    return {
      id: currentStateToUpdate.id,
      currentWeight: currentStateToUpdate.currentWeight,
      currentHeight: currentStateToUpdate.currentHeight,
      currentAge: currentStateToUpdate.currentAge,
      createdAt: currentStateToUpdate.createdAt,
      updatedAt: currentStateToUpdate.updatedAt,
    };
  }

  public async deleteCurrentState(
    userTraineeId: number,
    currentStateId: number,
  ) {
    const currentStateToDelete =
      await this.getSingleCurrentState(userTraineeId, currentStateId);
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    if (trainee.id !== currentStateToDelete.trainee.id) {
      throw new ForbiddenException(
        'You are not allowed to delete this current state',
      );
    }
    await this.currentStateRepository.delete(currentStateId);
    return {
      message: 'Current state deleted successfully',
    };
  }
}
