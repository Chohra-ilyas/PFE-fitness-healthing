import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AccessTokenType, JWTPayload } from 'src/utils/types';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { LoginDto } from './dtos/login.dto';
import { Trainer } from '../trainers/entities/trainer.entity';

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(User)
    private readonly trainersRepository: Repository<Trainer>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create a new user
   * @param registerDto
   * @returns JWT (access token)
   */
  public async registerUser(
    registerDtoUser: RegisterUserDto,
  ): Promise<AccessTokenType> {
    const { email, password, username , gender , age } = registerDtoUser;
    const userFromDb = await this.usersRepository.findOne({ where: { email } });
    if (userFromDb) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    let newUser = await this.usersRepository.create({
      email,
      password: hashedPassword,
      username,
      age,
      gender,
    });
    newUser = await this.usersRepository.save(newUser);
    const accessToken = await this.generateToken(newUser);

    return { accessToken };
  }

  /**
   * Login a user
   * @param loginDto
   * @returns JWT (access token)
   */
  public async login(loginDto: LoginDto): Promise<AccessTokenType> {
    const { email, password } = loginDto;
    const userFromDb = await this.usersRepository.findOne({ where: { email } });
    if (!userFromDb) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, userFromDb.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const accessToken = await this.generateToken(userFromDb);
    return { accessToken };
  }

  /**
   * Create a new Trainer
   * @param userId id of the logged in user
   * @param createTrainerDto Data to create a new trainer
   * @returns new trainer
   */

  /**
   * Hash password
   * @param password plain password
   * @returns hashed password
   */
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Generate JWT
   * @param paylod
   * @returns token
   */
  private generateToken(user: User): Promise<string> {
    const paylod: JWTPayload = { id: user.id, userType: user.userType };
    return this.jwtService.signAsync(paylod);
  }
}
