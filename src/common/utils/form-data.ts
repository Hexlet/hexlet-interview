import { ValidationError } from 'class-validator';

export class FormData {
  constructor(public readonly values: object = {}, public readonly errors: ValidationError[] = []) {}

  private getPropertyError(property: string): ValidationError | undefined {
    return this.errors.find(error => error.property === property);
  }

  hasErrors(): boolean {
    return this.errors.length !== 0;
  }

  hasPropertyError(property: string): boolean {
    return !!this.getPropertyError(property);
  }

  getPropertyValue(property: string): string {
    return this.values[property] || '';
  }

  getPropertyErrorMessages(property: string): string[] {
    if (!this.getPropertyError(property)) {
      return [];
    }
    const { constraints } = this.getPropertyError(property) as ValidationError;
    return Object.entries(constraints).map(([, errorMsg]) => errorMsg);
  }
}
