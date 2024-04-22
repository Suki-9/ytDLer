import { createWriteStream } from 'fs';
import { exec } from 'child_process';
import { Readable } from 'stream';

import ytdl from 'ytdl-core';

const isAudioType = (type: string): type is MimeTypes['audio'] => type.includes('audio/');
const isVideType = (type: string): type is MimeTypes['video'] => type.includes('video/');

const taskQueue = new Map<string, Task>();

const createId = () => new Date().getTime().toString(36) +
  crypto.getRandomValues(new Int8Array(4)).reduce((a, n) => a + Math.abs(n).toString(36), "");

const fileConvert = async (
  before: string,
  mineType: MimeTypes['audio'],
) => new Promise<string>((resolve, reject) => {
  const result = `${createId()}.${mineType.split('/')[1]}`
  return exec(`ffmpeg -i ${before} ./Public/files/${result}`, (err, stdout, stderr) =>
    err
      ? reject(new Error('convert failed!!'))
      : resolve(result)
  );
});

const videoEncode = async (
  videoFileName: string,
  audioFileName: string,
  mineType: MimeTypes['video'],
) => new Promise<string>((resolve, reject) => {
  const result = `${createId()}.${mineType.split('/')[1]}`
  return exec(`ffmpeg -i ./Public/DL/${videoFileName} -i ./Public/DL/${audioFileName} -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 ./Public/files/${result}`,
    (err) => err
      ? reject(new Error('convert failed!!'))
      : resolve(result)
  );
});

export const downloader = async (
  id: string,
  url: string,
  fileName: string,
  mimeType: MimeTypes[keyof MimeTypes],
) => {
  const task = new Task(url, fileName, mimeType);
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
    | 'Video encoding'
    | 'completed'

  private readonly url: string;
  private readonly fileName: string;
  private readonly mimeType: MimeTypes[keyof MimeTypes];
  private stream: {
    audio?: Readable,
    video?: Readable,
  } = {};
  private progress: number = 0;
  
  constructor(url: string, fileName: string, mimeType: MimeTypes[keyof MimeTypes]) {
    this.state = 'init';
    this.url = url;
    this.fileName = fileName;
    this.mimeType = mimeType;
  }

  public getProgress(): number {
    if (this.state === 'Audio downloading' && this.stream.audio) return this.progress;
    else if (this.state === 'Video downloading' && this.stream.video) return this.progress;
    else if (this.state === 'init') return 0;
    else if (this.state === 'completed') return 100;
    else if (this.state === 'Video encoding') return 100;

    return -1;
  }

  public async getInfo() {
    return ytdl.getInfo(this.url);
  };

  public async download(): Promise<string> {
    try {
      await this.downloadAudio();
    } catch (e) { throw e; }
    if (isVideType(this.mimeType)) {
      try {
        await this.downloadVideo();
        this.state = 'completed';
        return await videoEncode(`${this.fileName}.mp4`, `${this.fileName}.wav`, this.mimeType);
      } catch (e) { throw e; }
    } else if (isAudioType(this.mimeType) && this.mimeType == 'audio/wav') {
      try {
        this.state = 'completed';
        return await fileConvert(`${this.fileName}.wav`, this.mimeType);
      } catch (e) { throw e; }
    } else {
      try {
        const fileName = `${createId()}.wav`
        this.state = 'completed';
        return fileName;
      } catch (e) { throw e; }
    }
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
}

export const getProgress = (id: string): {
  status: string;
  progress: number;
} => {
  const task = taskQueue.get(id);
  if (task) {
    return {
      status: task.state,
      progress: task.getProgress(),
    }
  } else {
    return {
      status: 'Not Found',
      progress: -1,
    }
  }
};
