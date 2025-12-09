import { Module } from '@nestjs/common';
import { LtiModule } from './lti/lti.module';

@Module({
  imports: [LtiModule],
})
export class AppModule {}
