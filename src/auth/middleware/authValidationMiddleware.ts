import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { validateOrReject, ValidationError } from 'class-validator';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body as unknown as LoginDto;
    const login = new LoginDto();
    const errors: string[] = [];

    Object.keys(body).forEach((key: keyof typeof body) => {
      login[key] = body[key];
    });

    try {
      await validateOrReject(login);
    } catch (errs) {
      errs.forEach((err: ValidationError) => {
        if (err.constraints) {
          Object.values(err.constraints).forEach((constraint) => {
            errors.push(constraint);
          });
        }
      });
    }

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    next();
  }
}
