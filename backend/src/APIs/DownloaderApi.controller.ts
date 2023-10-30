import { Controller, Post, Body } from '@nestjs/common';
import { DownloaderApiService } from './DownloaderApi.service';

@Controller('/api')
export class DownloaderApiController {
  constructor(private readonly ytDownloader: DownloaderApiService) {}

  @Post('youtube-dl')
  async Downloader(@Body() body: { url: string; id: string }): Promise<string> {
    try {
      const FileURL = await this.ytDownloader.Downloader(body.url, body.id);
      return JSON.stringify({
        msg: 'DL Success!!!',
        DL_Link: FileURL,
      });
    } catch (err) {
      console.error(err);
      return JSON.stringify({
        msg: 'Dl fail!!!',
      });
    }
  }
}
