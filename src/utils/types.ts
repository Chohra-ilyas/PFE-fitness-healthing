export type JWTPayload = {
    id: number;
    userType: string;
}

export type AccessTokenType = { 
    accessToken: string;
}

import { ValueTransformer } from 'typeorm';

export class StringOrNumberTransformer implements ValueTransformer {
  to(value: string | number): string {
    return value?.toString();
  }

  from(value: string): string | number {
    if (!value) return value;
    return isNaN(Number(value)) ? value : Number(value);
  }
}