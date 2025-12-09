import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('lti')
export class PlatformsLtiController {
  constructor() {}

  @Get('nolti')
  nolti(@Req() req: Request, @Res() res: Response) {
    res.send('SUPPORT_MESSAGE');
  }

  @Get('ping')
  ping(@Req() req: Request, @Res() res: Response) {
    res.send('pong');
  }

  @Get('protected')
  protected(@Req() req: Request, @Res() res: Response) {
    res.send('Insecure');
  }
}
