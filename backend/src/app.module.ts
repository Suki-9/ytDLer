import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { CorsMiddleware } from './middlewares/cors.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';

import { APIController, APIService } from './APIs/API.modules';

import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './Downloaded'),
      serveStaticOptions: {
        redirect: false,
      },
    }),
  ],
  controllers: [...APIController],
  providers: [...APIService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
