import { Injectable, Logger } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { exec, ExecException } from 'child_process';

import ytdl = require('ytdl-core');

@Injectable()
export class DownloaderApiService {
  private readonly logger = new Logger(DownloaderApiService.name);

  public mimeTypes = {
    audio: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/ogg'],
    video: ['video/mp4', 'video/avi'],
  };

  private fileConvert = async (
    before: string,
    after: string,
  ): Promise<boolean | ExecException> =>
    new Promise<boolean | ExecException>((resolve, reject) =>
      exec(`ffmpeg -i ${before} ${after}`, (err, stdout, stderr) =>
        err
          ? (this.logger.error(stderr), reject(err))
          : (this.logger.log(stdout), resolve(true)),
      ),
    );

  Downloader = async (
    url: string,
    id: string,
    options: YtdlPayload['options'],
  ): Promise<YtdlResponse> =>
    new Promise(async (resolve, reject) => {
      const audio = ytdl(url, { quality: 'highestaudio' });
      audio.pipe(createWriteStream(`./Public/DL/${id}.wav`));
      audio.on('end', async () => {
        const info = await ytdl.getInfo(url);
        const downloadURL = `./Public/DL/result_${id}.${
          options.mimeType.split('/')[1]
        }`;

        if (this.mimeTypes.audio.indexOf(options.mimeType) !== -1) {
          if (options.mimeType !== 'audio/wav')
            try {
              this.fileConvert(`./Public/DL/${id}.wav`, downloadURL);
            } catch {
              reject('convert failed!!');
            }

          resolve({
            url: downloadURL.replace('./Public', ''),
            title: info.videoDetails.title,
            uploadDate: info.videoDetails.uploadDate,
            videoId: info.videoDetails.videoId,
            viewCount: info.videoDetails.viewCount,
          });
        } else {
          const video = ytdl(url, {
            filter: (format) => format.container === 'mp4',
          });
          video.pipe(createWriteStream(`./Public/DL/${id}.mp4`));
          video.on('end', () => {
            exec(
              `ffmpeg -i ./Public/DL/${id}.mp4 -i ./Public/DL/${id}.wav -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 ${downloadURL}`,
              (err, stdout, stderr) => {
                if (err) this.logger.error(stderr), reject(err);
                else
                  this.logger.log(stdout),
                    resolve({
                      url: downloadURL.replace('./Public', ''),
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
}
