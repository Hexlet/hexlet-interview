import { ValidationError } from 'class-validator';

export class FormData {
  constructor(
    public readonly values: { [key: string]: string | number } = {},
    public readonly errors: ValidationError[] = [],
  ) {}

  private getPropertyError(property: string): ValidationError | undefined {
    return this.errors.find(error => error.property === property);
  }

  hasErrors(): boolean {
    return this.errors.length !== 0;
  }

  hasPropertyError(property: string): boolean {
    return !!this.getPropertyError(property);
  }

  getPropertyValue(property: string): string | number {
    return this.values[property] || '';
  }

  getPropertyErrorMessages(property: string): string[] {
    const errors = this.getPropertyError(property);
    if (!errors) {
      return [];
    }
    const { constraints } = errors;
    return Object.entries(constraints).map(([, errorMsg]) => errorMsg);
  }
}
