import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { CreateReviewDto } from './dtos/createReview.dto';
import { JWTPayload } from 'src/utils/types';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { AuthRolesGuard } from 'src/users/guards/auth-role.guard';
import { Roles } from 'src/users/decorators/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { UpdateReviewDto } from './dtos/updateReview.dto';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':trainerId')
  @UseGuards(AuthGuard)
  async createReview(
    @Param('trainerId', ParseIntPipe) trainerId: number,
    @Body() body: CreateReviewDto,
    @CurrentUser() payload: JWTPayload,
  ) {
    return this.reviewsService.createReview(payload.id, trainerId, body);
  }

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getAllReviews() {
    return this.reviewsService.getAllReviews();
  }

  @Get(':reviewId')
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  async getReviewById(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reviewsService.getReviewById(reviewId);
  }

  @Put(':reviewId')
  @UseGuards(AuthGuard)
  async updateReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() UpdateReviewDto: UpdateReviewDto,
    @CurrentUser() payload: JWTPayload,
  ) {
    return this.reviewsService.updateReview(reviewId, payload.id, UpdateReviewDto);
  }

  @Delete(':reviewId')
  @Roles(UserType.TRAINEE, UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  async deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @CurrentUser() payload: JWTPayload,
  ) {
    return this.reviewsService.deleteReview(reviewId, payload.id);
  }
}
