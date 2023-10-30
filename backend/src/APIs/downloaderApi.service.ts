import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
//import { writeFile } from 'fs/promises';
//import { resolve } from 'path';

import ytdl = require('ytdl-core');

@Injectable()
export class DownloaderApiService {
  Downloader = async (url: string, id: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = ytdl(url, {
        filter: (format) => format.container === 'mp4',
      });

      video.pipe(createWriteStream(`./Public/DL/${id}.mp4`));

      video.on('end', () => {
        resolve(`/DL/${id}.mp4`);
      });
    });
  };
}
