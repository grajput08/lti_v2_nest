import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as ltijs from 'ltijs';
import Database from 'ltijs-sequelize';

@Injectable()
export class LtiService implements OnModuleInit {
  private readonly logger = new Logger(LtiService.name);
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
      // const url = `http://localhost:3000/?ltik=${token}`;
      // this.logger.log('LTI Launch Success → Redirecting to frontend...');
      // return res.redirect(url);
      this.logger.log(`LTI Launch Successful`);
      return res.send(`It's alive, LTI launch success!`);
    });

    // Whitelisting the main app route and /nolti to create a landing page
    this.lti.whitelist(
      {
        route: new RegExp(/^\/nolti$/),
        method: 'get',
      },
      {
        route: new RegExp(/^\/ping$/),
        method: 'get',
      },
      {
        route: new RegExp(/^\/registerPlatform$/),
        method: 'post',
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

  use(req: any, res: any, next: () => void) {
    this.lti.app(req, res, next);
  }
}
