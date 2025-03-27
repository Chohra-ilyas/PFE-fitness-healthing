import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenType, JWTPayload } from 'src/utils/types';
import { AuthProvider } from './auth.provider';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { LoginDto } from './dtos/login.dto';
import { UserType } from 'src/utils/enums';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly authService: AuthProvider,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Create a new user
   * @param registerDto
   * @returns JWT (access token)
   */
  public async register(
    registerDto: RegisterUserDto,
  ): Promise<AccessTokenType> {
    return this.authService.registerUser(registerDto);
  }

  /**
   * Login a user
   * @param loginDto
   * @returns JWT (access token)
   */
  public async login(loginDto: LoginDto): Promise<AccessTokenType> {
    return this.authService.login(loginDto);
  }

  /**
   * Get current user (logged in user)
   * @param id id of the logged in user
   * @returns user
   */
  public async getCurrentUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user does not exist');
    return user;
  }

  /**
   * Update user type
   * @param id
   * @param userType
   * @returns updated user
   */
  public async updateUserType(id: number, userType: UserType) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user does not exist');
    user.userType = userType;
    this.usersRepository.save(user);
  }

  /**
   * update profile picture
   * @param userId
   * @param file
   * @returns updated user
   */
  public async updateProfilePicture(userId: number, file: Express.Multer.File) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('user does not exist');
    if(user.profileImagePublicId){
      await this.cloudinaryService.deleteImage(user.profileImagePublicId);
    }
    const { secure_url, public_id } = await this.cloudinaryService.uploadFile(file);
    user.profileImage = secure_url;
    user.profileImagePublicId = public_id;
    return await this.usersRepository.save(user);
  }

  /**
   * delete profile picture
   * @param userId
   * @returns updated user
   */
  public async deleteProfilePicture(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('user does not exist');
    if(user.profileImagePublicId){
      await this.cloudinaryService.deleteImage(user.profileImagePublicId);
    }
    user.profileImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';
    user.profileImagePublicId = null;
    return await this.usersRepository.save(user);
  }
  /**
   * Get all users from database
   * @returns all users
   */

  /**
   * Update user
   * @param id
   * @param updateUserDto
   * @returns updated user
   */
}
