import {
  BadRequestException,
  ConsoleLogger,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/reviews.entity';
import { TrainerService } from 'src/trainers/trainer.service';
import { TraineeService } from 'src/trainees/trainee.service';
import { CreateReviewDto } from './dtos/createReview.dto';
import { UpdateReviewDto } from './dtos/updateReview.dto';
import { UserType } from 'src/utils/enums';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly trainerService: TrainerService,
    private readonly traineeService: TraineeService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Create a new review
   * @param userTraineeId id of the logged in trainee
   * @param userTrainerId id of the trainer to review
   * @param dto Data to create a new review
   * @returns new review
   */
  public async createReview(
    userTraineeId: number,
    userTrainerId: number,
    dto: CreateReviewDto,
  ) {
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    const trainer = await this.trainerService.getTrainerByUserId(userTrainerId);
    if (userTraineeId === userTrainerId) {
      throw new NotFoundException('Trainee and Trainer cannot be the same');
    }
    const trainerId = trainer.id;
    const traineeId = trainee.id;
    if (!trainee.trainer) {
      throw new BadRequestException('You need to have a trainer to review');
    }
    if (trainerId !== trainee.trainer.id) {
      throw new ForbiddenException('you can review only your trainer');
    }
    const reviews = await this.reviewsRepository.find({
      where: { trainee: { id: traineeId } },
      relations: ['trainer'],
    });

    if (reviews.length > 0) {
      reviews.find((review) => {
        if (review.trainer.id === trainerId) {
          throw new BadRequestException(
            'you can review only once for every trainer',
          );
        }
      });
    }
    const review = this.reviewsRepository.create({ ...dto, trainee, trainer });
    await this.reviewsRepository.save(review);
    this.trainerService.calculateRating(userTrainerId);
    return review;
  }

  /**
   * Get all reviews
   * @returns all reviews
   */
  public async getAllReviews() {
    return await this.reviewsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['trainee', 'trainer'],
    });
  }

  /**
   * Get a review by id
   * @param id id of the review
   * @returns a review
   */
  public async getReviewById(reviewId: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['trainee', 'trainer'],
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  /**
   * Update a review
   * @param reviewId id of the review
   * @param userTraineeId id of the logged in trainee
   * @param dto Data to update a review
   * @returns updated review
   */
  public async updateReview(
    reviewId: number,
    userTraineeId: number,
    dto: UpdateReviewDto,
  ) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['trainee'],
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    const trainee = await this.traineeService.getTraineeByUserId(userTraineeId);
    if (trainee.id !== review.trainee.id) {
      throw new ForbiddenException('You can only update your review');
    }
    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;
    await this.reviewsRepository.save(review);
    this.trainerService.calculateRating(trainee.trainer.user.id);
    return {
      id: review.id,
      reting: review.rating,
      review: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  /**
   * Delete a review
   * @param reviewId id of the review
   * @param userTraineeId id of the logged in trainee
   * @returns deleted review
   */
  public async deleteReview(reviewId: number, userTraineeId: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['trainee'],
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    const user = await this.usersService.getCurrentUser(userTraineeId);
    if (user.userType === UserType.TRAINEE) {
      const trainee =
        await this.traineeService.getTraineeByUserId(userTraineeId);
      if (trainee.id === review.trainee.id) {
        await this.reviewsRepository.remove(review);
        this.trainerService.calculateRating(trainee.trainer.user.id);
        return { message: 'Review deleted successfully' };
      }
    } else if (user.userType === UserType.ADMIN) {
      const trainer = review.trainer;
      await this.reviewsRepository.remove(review);
      this.trainerService.calculateRating(trainer.user.id);
      return { message: 'Review deleted successfully' };
    }
    throw new ForbiddenException('You can only delete your review');
  }
}
