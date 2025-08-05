import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  <T = unknown>(
    data: keyof T | undefined,
    ctx: ExecutionContext,
  ): T | T[keyof T] | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: T }>();
    const user = request.user;

    if (!user) return undefined;
    return data ? user[data] : user;
  },
);
