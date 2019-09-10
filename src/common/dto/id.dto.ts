import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class IdParamDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
