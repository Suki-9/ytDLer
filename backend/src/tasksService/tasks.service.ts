import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { readdirSync, rmSync } from 'fs';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('* * 4 * * *') //CronExpression.EVERY_10_SECONDS)
  handleCron() {
    readdirSync('./Public/DL').forEach((fileName: string) => {
      rmSync(`./Public/DL/${fileName}`);
      this.logger.log(`Deleted file ${fileName}!`);
    });
  }
}
