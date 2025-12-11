import {
  Injectable,
  Logger,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Provider as lti } from 'ltijs';
import Database from 'ltijs-sequelize';

@Injectable()
export class LtiMiddleware implements NestMiddleware, OnModuleInit {
  private readonly logger = new Logger(LtiMiddleware.name);

  async onModuleInit() {
    const db = new Database('nestdb', 'gatikrajput', 'Gatik@12345', {
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      logging: false,
    });

    // Setup the Provider (it's already an instance, not a class)
    lti.setup(
      'TA8umJBVGKaZ6f8aD4kJtcFz4QyVRmGkNXMAYR47F73VQaLGDkPxrA2hAfBTmhY3',
      {
        plugin: db,
      },
      {
        appRoute: '/',
        keysetRoute: '/keys',
        loginRoute: '/login',
        devMode: true,
      },
    );

    lti.onConnect((token: any, res: any) => {
      try {
        const url = `http://localhost:3000/?ltik=kTwumBZLuhzfTa6YF7VWMfu4GuYk4m9M6PL7VuLB4fCNxLDvxQzEB6cKuexnJz9v`;
        this.logger.log('LTI Launch Success → Redirecting to frontend...');
        return res.redirect(url);
      } catch (error) {
        this.logger.error('Error in onConnect:', error);
        return res.status(500).send('Error in onConnect');
      }
    });

    this.logger.log(`Deploying LTI provider...`);
    await lti.deploy({ serverless: true });

    await lti.registerPlatform({
      url: 'https://canvas.instructure.com',
      name: 'Canvas LMS',
      clientId: '10000000000011',
      authenticationEndpoint: 'http://canvas.docker/api/lti/authorize_redirect',
      accesstokenEndpoint: 'http://canvas.docker/login/oauth2/token',
      authConfig: {
        method: 'JWK_SET',
        key: 'http://canvas.docker/api/lti/jwks',
      },
    });
  }

  use(req: Request, res: Response, next: () => void) {
    lti.app(req, res, next);
  }
}
