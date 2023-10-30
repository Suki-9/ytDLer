import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { DownloaderApiService } from './downloaderApi.service';

import { Response } from 'express';

@Controller('/api')
export class DownloaderApiController {
  constructor(private readonly ytDownloader: DownloaderApiService) {}
  private readonly logger = new Logger(DownloaderApiController.name);

  @Post('youtube-dl')
  async Downloader(
    @Body() body: { url: string; id: string },
    @Res() res: Response,
  ): Promise<void> {
    try {
      res.status(200).json({
        msg: 'DL Success!',
        url: await this.ytDownloader.Downloader(body.url, body.id),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'DL fail!!!' });
    }
  }
}
