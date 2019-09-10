import { IsString } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  interviewer: string;

  @IsString()
  interviewee: string;

  @IsString()
  videoLink: string;
}
