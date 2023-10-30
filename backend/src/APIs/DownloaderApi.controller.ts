import { Controller, Post, Body, Res } from '@nestjs/common';
import { DownloaderApiService } from './DownloaderApi.service';

import { Response } from 'express';

@Controller('/api')
export class DownloaderApiController {
  constructor(private readonly ytDownloader: DownloaderApiService) {}

  @Post('youtube-dl')
  async Downloader(
    @Body() body: { url: string; id: string },
    @Res() res: Response,
  ): Promise<void> {
    try {
      const FileURL = await this.ytDownloader.Downloader(body.url, body.id);
      res.status(200).json({ msg: 'DL Success!!!', DL_Link: FileURL });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Dl fail!!!' });
    }
  }
}
