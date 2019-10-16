import { IsNotEmpty, IsISO8601, IsUrl } from 'class-validator';
import { IsOptional } from '../../../common/validators/custom.validators';

export class InterviewAssignmentDto {
  @IsNotEmpty()
  readonly interviewerId: string;

  @IsNotEmpty()
  @IsISO8601()
  readonly date: string;

  @IsUrl()
  @IsOptional()
  readonly videoLink: string;
}
