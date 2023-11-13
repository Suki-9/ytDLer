import { Injectable, Logger } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { exec } from 'child_process';

import ytdl = require('ytdl-core');

@Injectable()
export class DownloaderApiService {
  private readonly logger = new Logger(DownloaderApiService.name);

  Downloader = async (
    url: string,
    id: string,
    options: Record<string, boolean>,
  ): Promise<Record<string, string>> => {
    return new Promise(async (resolve) => {
      let downloadURL = `/DL/result_${id}.mp4`;
      const info = await ytdl.getInfo(url);
      const audio = ytdl(url, { quality: 'highestaudio' });
      audio.pipe(createWriteStream(`./Public/DL/${id}.wav`));

      audio.on('end', async () => {
        if (options.soundOnly) {
          exec(
            `ffmpeg -i ./Public/DL/${id}.wav -vn -ac 2 -ar 44100 -ab 256k -acodec libmp3lame -f mp3 ./Public/DL/result_${id}.mp3`,
            (err, stdout, stderr) => {
              if (err) this.logger.error(stderr);
              else this.logger.log(stdout);
              resolve({
                url: downloadURL,
                title: info.videoDetails.title,
                uploadDate: info.videoDetails.uploadDate,
                videoId: info.videoDetails.videoId,
                viewCount: info.videoDetails.viewCount,
              });
            },
          );
          downloadURL = `/DL/result_${id}.mp3`;
        } else {
          const video = ytdl(url, {
            filter: (format) => format.container === 'mp4',
          });

          video.pipe(createWriteStream(`./Public/DL/${id}.mp4`));

          video.on('end', () => {
            exec(
              `ffmpeg -i ./Public/DL/${id}.mp4 -i ./Public/DL/${id}.wav -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 ./Public/DL/result_${id}.mp4`,
              (err, stdout, stderr) => {
                if (err) this.logger.error(stderr);
                else this.logger.log(stdout);
                resolve({
                  url: downloadURL,
                  title: info.videoDetails.title,
                  uploadDate: info.videoDetails.uploadDate,
                  videoId: info.videoDetails.videoId,
                  viewCount: info.videoDetails.viewCount,
                });
              },
            );
          });
        }
      });
    });
  };
}
