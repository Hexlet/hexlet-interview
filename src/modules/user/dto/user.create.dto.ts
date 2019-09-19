import { IsNotEmpty, IsEmail, Equals } from 'class-validator';
import passport = require('passport');


export class UserCreateDto {
  @IsNotEmpty()
  readonly firstname: string;

  readonly lastname: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly confirmpassword: string;
}
