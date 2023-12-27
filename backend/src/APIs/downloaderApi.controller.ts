import { Controller, Post, Body, Res } from '@nestjs/common';
import { DownloaderApiService } from './downloaderApi.service';

import { Response } from 'express';

@Controller('/api')
export class DownloaderApiController {
  constructor(private readonly ytDownloader: DownloaderApiService) {}
  // private readonly logger = new Logger(DownloaderApiController.name);

  @Post('youtube-dl')
  async Downloader(
    @Body()
    body: YtdlPayload,
    @Res() res: Response,
  ): Promise<void> {
    try {
      if (
        Object.values(this.ytDownloader.mimeTypes)
          .flat()
          .indexOf(body.options.mimeType) !== -1
      ) {
        res.status(200).json({
          msg: 'DL Success!',
          url: body.url,
          ...(await this.ytDownloader.Downloader(
            body.url,
            body.id,
            body.options,
          )),
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: 'DL fail!!!' });
    }
  }
}
