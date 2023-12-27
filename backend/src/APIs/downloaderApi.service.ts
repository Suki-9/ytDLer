import { Injectable, Logger } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { exec, ExecException } from 'child_process';

import ytdl = require('ytdl-core');

@Injectable()
export class DownloaderApiService {
  private readonly logger = new Logger(DownloaderApiService.name);

  public mimeType = {
    audio: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/ogg'],
    video: ['video/mp4', 'video/avi'],
  } as const;

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
    new Promise(async (resolve, reject) =>
      ytdl(url, { quality: 'highestaudio' })
        .pipe(createWriteStream(`./Public/DL/${id}.wav`))
        .on('end', async () => {
          const info = await ytdl.getInfo(url);
          const downloadURL = `./Public/DL/result_${id}.${
            options.mimeType.split('/')[1]
          }`;

          if (options.soundOnly && options.mimeType in this.mimeType) {
            // デフォルトの wav 以外はコンバートする。
            if (options.mimeType !== 'audio/wav')
              try {
                this.fileConvert(`./Public/DL/${id}.wav`, downloadURL);
              } catch {
                reject('convert failed!!');
              }

            resolve({
              url: downloadURL,
              title: info.videoDetails.title,
              uploadDate: info.videoDetails.uploadDate,
              videoId: info.videoDetails.videoId,
              viewCount: info.videoDetails.viewCount,
            });
          } else {
            ytdl(url, {
              filter: (format) => format.container === 'mp4',
            })
              .pipe(createWriteStream(`./Public/DL/${id}.mp4`))
              .on('end', () => {
                exec(
                  `ffmpeg -i ./Public/DL/${id}.mp4 -i ./Public/DL/${id}.wav -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 ${downloadURL}`,
                  (err, stdout, stderr) => {
                    if (err) this.logger.error(stderr), reject(err);
                    else
                      this.logger.log(stdout),
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
        }),
    );
}
