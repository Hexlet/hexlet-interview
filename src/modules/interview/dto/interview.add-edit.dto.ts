import { IsNotEmpty, IsEnum, IsUrl } from 'class-validator';
import { IsOptional } from '../../../common/validators/custom.validators';
import { interviewState } from '../interview.entity';

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
  @IsEnum(interviewState)
  readonly state: interviewState;
}
