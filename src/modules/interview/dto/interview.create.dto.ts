import { IsNotEmpty } from 'class-validator';

export class InterviewCreateDto {
  @IsNotEmpty()
  readonly profession: string;

  @IsNotEmpty()
  readonly position: string;

  readonly description?: string;
}
