import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';

import { CorsMiddleware } from './middlewares/cors.middleware';
import { APIController, APIService } from './APIs/API.modules';
import { TasksService } from './tasksService/tasks.service';

import { join } from 'path';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './Public'),
      serveStaticOptions: {
        redirect: false,
      },
    }),
  ],
  controllers: [...APIController],
  providers: [...APIService, TasksService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
