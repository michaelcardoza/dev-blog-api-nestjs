import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    return user ? { ...user } : null;
  },
);
