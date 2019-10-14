import { IsNotEmpty, IsISO8601 } from 'class-validator';

export class InterviewAssignmentDto {
  @IsNotEmpty()
  readonly interviewer: string;

  @IsNotEmpty()
  @IsISO8601()
  readonly date: string;

  readonly videoLink?: string;
}
