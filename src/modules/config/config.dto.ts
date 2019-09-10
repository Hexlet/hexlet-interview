import { IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfigDto {
  @IsString()
  DB_HOST: string;

  @Type(() => Number)
  @IsInt()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;
}
