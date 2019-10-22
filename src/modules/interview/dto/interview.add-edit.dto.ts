import { IsNotEmpty, IsUrl } from 'class-validator';
import { IsOptional } from '../../../common/validators/custom.validators';

export class InterviewAddEditDto {
  @IsNotEmpty()
  readonly profession: string;

  @IsNotEmpty()
  readonly position: string;

  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  readonly intervieweeId: string;

  @IsOptional()
  readonly interviewerId: string;

  @IsOptional()
  readonly date: string;

  @IsUrl()
  @IsOptional()
  readonly videoLink: string;

  @IsNotEmpty()
  readonly state: string;
}
