import { IsNotEmpty, IsEmail, Equals } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  readonly firstname: string;

  @IsNotEmpty()
  readonly lastname?: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password?: string;

  @IsNotEmpty()
  readonly confirmpassword?: string;
}
