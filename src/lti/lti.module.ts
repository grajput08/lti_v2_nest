import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LtiService } from './lti.service';
import { PlatformsLtiController } from './lti.controller';
import { LtiMiddleware } from './lti.middleware';

@Module({
  controllers: [PlatformsLtiController],
  providers: [LtiService],
})
export class LtiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LtiMiddleware).forRoutes('*');
  }
}
