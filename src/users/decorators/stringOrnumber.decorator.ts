import { registerDecorator, ValidationOptions } from 'class-validator';

// Custom decorator to allow only string or number
export function IsStringOrNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsStringOrNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' || typeof value === 'number';
        },
        defaultMessage() {
          return 'exerciseReps must be a string or number';
        },
      },
    });
  };
}
