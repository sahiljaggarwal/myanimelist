import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RoleCheckMiddleware {
  constructor(private readonly requiredRole: string) {}

  createMiddleware(): (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole = req['user']?.role;

      if (!userRole || userRole !== this.requiredRole) {
        throw new UnauthorizedException('Access denied');
      }

      console.log(userRole);
      next();
    };
  }
}
