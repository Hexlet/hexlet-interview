import { SetMetadata } from '@nestjs/common';

export const Role = (...role: string[]): Function => SetMetadata('role', role);
