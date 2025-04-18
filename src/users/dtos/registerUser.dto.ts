import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/utils/enums';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(250)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 150)
  username: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(Gender)
  gender: Gender;
}
