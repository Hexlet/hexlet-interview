import { IsNotEmpty } from 'class-validator';

export class RequestCreateDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly profession: string;

  @IsNotEmpty()
  readonly position: string;

  readonly description?: string;
}
