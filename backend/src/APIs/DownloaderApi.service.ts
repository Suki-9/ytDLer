import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';

import ytdl = require('ytdl-core');

@Injectable()
export class DownloaderApiService {
  Downloader = async (url: string, id: string) => {
    ytdl(url).pipe(createWriteStream(`./Downloaded/${id}.mp4`));
    return `/DL/${id}.mp4`;
  };
}
