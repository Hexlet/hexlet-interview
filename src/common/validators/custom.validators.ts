import { ValidateIf, ValidationOptions } from 'class-validator';

export function IsOptional(validationOptions?: ValidationOptions): (object: object, propertyName: string) => void {
  return ValidateIf((_obj, value) => {
    return value !== null && value !== undefined && value !== '';
  }, validationOptions);
}
