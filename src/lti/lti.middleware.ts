import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LtiService } from './lti.service';

@Injectable()
export class LtiMiddleware implements NestMiddleware {
  constructor(private readonly ltiService: LtiService) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.ltiService.use(req, res, next);
  }
}
