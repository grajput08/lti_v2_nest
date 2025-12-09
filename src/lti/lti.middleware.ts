import {
  Injectable,
  Logger,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as ltijs from 'ltijs';
import Database from 'ltijs-sequelize';

@Injectable()
export class LtiMiddleware implements NestMiddleware, OnModuleInit {
  private readonly logger = new Logger(LtiMiddleware.name);
  private lti: typeof ltijs.Provider;

  async onModuleInit() {
    const db = new Database('nestdb', 'gatikrajput', 'Gatik@12345', {
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      logging: false,
    });

    // Setup the Provider (it's already an instance, not a class)
    ltijs.Provider.setup(
      'kTwumBZLuhzfTa6YF7VWMfu4GuYk4m9M6PL7VuLB4fCNxLDvxQzEB6cKuexnJz9v',
      {
        plugin: db,
      },
      {
        appUrl: '/',
        loginRoute: '/login',
        cookies: {
          secure: false,
          sameSite: 'None',
        },
        devMode: true,
      },
    );

    this.lti = ltijs.Provider;

    this.lti.onConnect((token: any, res: any) => {
      try {
        const url = `http://localhost:3000/?ltik=${token}`;
        this.logger.log('LTI Launch Success → Redirecting to frontend...');
        return res.redirect(url);
        //   this.logger.log(`LTI Launch Successful`);
        //   return res.send(`It's alive, LTI launch success!`);
      } catch (error) {
        this.logger.error('Error in onConnect:', error);
        return res.status(500).send('Error in onConnect');
      }
    });
    // Whitelist the root route and other public routes if needed
    this.lti.whitelist(
      {
        route: '/',
        method: 'get',
      },
      {
        route: '/static/*',
        method: 'get',
      },
    );

    this.logger.log(`Deploying LTI provider...`);
    await this.lti.deploy({ port: 3001 });

    await this.lti.registerPlatform({
      url: 'https://canvas.instructure.com',
      name: 'Canvas LMS',
      clientId: '10000000000015',
      authenticationEndpoint: 'http://canvas.docker/api/lti/authorize_redirect',
      accesstokenEndpoint: 'http://canvas.docker/login/oauth2/token',
      authConfig: {
        method: 'JWK_SET',
        key: 'http://canvas.docker/api/lti/jwks',
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.lti.app(req, res, next);
  }
}
