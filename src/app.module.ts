import { Module } from '@nestjs/common';
import { LtiModule } from './lti/lti.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [LtiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
