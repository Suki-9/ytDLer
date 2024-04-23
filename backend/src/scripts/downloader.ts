import { copyFile, unlink } from 'fs/promises';
import { createWriteStream } from 'fs';
import { exec } from 'child_process';
import { Readable } from 'stream';

import ytdl from 'ytdl-core';

const isAudioType = (type: string): type is MimeTypes['audio'] => type.includes('audio/');
const isVideType = (type: string): type is MimeTypes['video'] => type.includes('video/');

const moveFile = async (
  oldPath: string,
  newPath: string
): Promise<void> => {
  try {
    await copyFile(oldPath, newPath);
    await unlink(oldPath);
  } catch (e) { throw e }
}

const taskQueue = new Map<string, Task>();

const createId = () => new Date().getTime().toString(36) +
  crypto.getRandomValues(new Int8Array(4)).reduce((a, n) => a + Math.abs(n).toString(36), "");

export const downloader = async (
  id: string,
  url: string,
  fileName: string,
  options: Endpoints['youtube-dl']['req']['options'],
) => {
  const task = new Task(url, fileName, options);
  taskQueue.set(id, task);
  return task.download().then(async (r) => {
    const info = await task.getInfo();
    taskQueue.delete(id);
    return {
      url: r,
      title: info.videoDetails.title,
      uploadDate: info.videoDetails.uploadDate,
      videoId: info.videoDetails.videoId,
      viewCount: Number(info.videoDetails.viewCount),
    };
  });
};

class Task {
  public state:
    | 'init'
    | 'Audio downloading'
    | 'Video downloading'
    | 'Media Converting'
    | 'Video encoding'
    | 'completed' = 'init';

  private readonly url: string;
  private readonly fileName: string;
  private readonly options: Endpoints['youtube-dl']['req']['options'];
  private progress: number = 0;
  private stream: {
    audio?: Readable,
    video?: Readable,
  } = {};

  constructor(
    url: string,
    fileName: string,
    options: Endpoints['youtube-dl']['req']['options'],
  ) {
    this.url = url;
    this.fileName = fileName;
    this.options = options;
  }


  public getProgress(): number {
    if (this.state === 'Audio downloading' && this.stream.audio) return this.progress;
    else if (this.state === 'Video downloading' && this.stream.video) return this.progress;
    else if (this.state === 'init') return 0;
    else if (
      this.state === 'completed' ||
      this.state === 'Video encoding' ||
      this.state === 'Media Converting'
    ) return 100;

    return -1;
  }

  public getInfo = async () => ytdl.getInfo(this.url);

  public async download(): Promise<string> {
    let filePath: string;

    if (!this.options.silent) {
      try {
        await this.downloadAudio();
      } catch (e) { throw e; }
    }

    if (isVideType(this.options.mimeType)) {
      try {
        await this.downloadVideo();
        if (this.options.silent) {
          if (this.options.mimeType != 'video/mp4') {
            filePath = await this.fileConvert(`${this.fileName}.mp4`);
          } else {
            filePath = `${createId()}.${this.options.mimeType.split('/')[1]}`;
            await moveFile(`./Public/DL/${this.fileName}.mp4`, `./Public/files/${this.fileName}.mp4`);
          }
          this.state = 'completed';
        } else {
          filePath = await this.videoEncode(`${this.fileName}.mp4`, `${this.fileName}.wav`);
          this.state = 'completed';
        }
        return filePath;
      } catch (e) { throw e; }

    } else if (isAudioType(this.options.mimeType)) {
      if (this.options.mimeType != 'audio/wav') try {
        filePath = await this.fileConvert(`${this.fileName}.wav`);
        this.state = 'completed';
      } catch (e) { throw e; }
      else try {
        filePath = `${createId()}.wav`;
        await moveFile(`./Public/DL/${this.fileName}.wav`, `./Public/files/${filePath}.wav`);
        this.state = 'completed';
      } catch (e) { throw e; }
      return filePath;

    } else { throw new Error() }
  }

  private async downloadVideo() {
    const filePath = `./Public/DL/${this.fileName}.mp4`;

    this.state = 'Video downloading';
    this.stream.video = ytdl(this.url, {
      filter: (format) => format.container === 'mp4',
    });
    this.stream.video.pipe(createWriteStream(filePath));

    this.stream.video.on('progress', (_, downloaded: number, total: number) => {
      this.progress = Math.round(downloaded / total * 100);
    });

    return new Promise<void>((resolve, reject) => {
      this.stream.video?.on('end', () => resolve());
      this.stream.video?.on('error', () => reject())
    });
  }

  private async downloadAudio() {
    const filePath = `./Public/DL/${this.fileName}.wav`;

    this.state = 'Audio downloading';
    this.stream.audio = ytdl(this.url, { quality: 'highestaudio' });
    this.stream.audio.pipe(createWriteStream(filePath));

    this.stream.audio.on('progress', (_, downloaded: number, total: number) => {
      this.progress = Math.round(downloaded / total * 100);
    });

    return new Promise<void>((resolve, reject) => {
      this.stream.audio?.on('end', () => resolve());
      this.stream.audio?.on('error', () => reject())
    });
  }

  private async videoEncode(
    videoFileName: string,
    audioFileName: string,
  ) {
    this.state = 'Video encoding';
    const resultPath = `${createId()}.${this.options.mimeType.split('/')[1]}`;

    return new Promise<string>((resolve, reject) => {
      exec(
        `ffmpeg -i ./Public/DL/${videoFileName} -i ./Public/DL/${audioFileName} -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 ./Public/files/${resultPath}`,
        (err) => err
          ? reject(new Error('convert failed!!'))
          : resolve(resultPath)
      );
    });
  }

  private async fileConvert(
    filePath: string,
  ) {
    this.state = 'Media Converting';
    const resultPath = `${createId()}.${this.options.mimeType.split('/')[1]}`;

    return new Promise<string>((resolve, reject) => {
      exec(`ffmpeg -i ./Public/DL/${filePath} ./Public/files/${resultPath}`,
        (err) => err
          ? reject(new Error('convert failed!!'))
          : resolve(resultPath)
      );
    });
  }
}

export const getProgress = (id: string): {
  status: string;
  progress: number;
} => {
  const task = taskQueue.get(id);
  return {
    status: task ? task.state : 'Not Found',
    progress: task ? task.getProgress() : -1,
  }
};
