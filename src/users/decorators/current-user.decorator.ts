import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CURRENT_USER_KEY } from 'src/utils/constanst';
import { JWTPayload } from 'src/utils/types';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload: JWTPayload = request[CURRENT_USER_KEY];
    return payload;
  },
);
