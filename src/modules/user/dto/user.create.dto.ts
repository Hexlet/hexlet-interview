import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  readonly firstName: string;

  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
