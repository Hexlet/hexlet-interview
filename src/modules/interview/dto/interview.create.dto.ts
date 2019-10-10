import { IsNotEmpty } from 'class-validator';

export class InterviewCreateDto {
  @IsNotEmpty()
  readonly profession: string;

  @IsNotEmpty()
  readonly position: string;

  @IsNotEmpty()
  readonly description: string;
}
