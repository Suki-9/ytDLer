type MimeTypes = {
  audio: 'audio/mp3' | 'audio/wav' | 'audio/flac' | 'audio/ogg';
  video: 'video/mp4' | 'video/avi';
};

type Endpoints = {
  'youtube-dl': {
    req: {
      id: string;
      url: string;
      options: {
        silent: boolean;
        mimeType: MimeTypes['audio'] | MimeTypes['video'];
      };
    };
    res: {
      url: {
        filePath: string;
        streamPath?: string;
      };
      title: string;
      uploadDate: string;
      videoId: string;
      viewCount: number;
      mimeType: MimeTypes['audio'] | MimeTypes['video'];
    };
  };
  'progress': {
    req: {
      id: string;
    },
    res: {
      status:
      | 'init'
      | 'Audio downloading'
      | 'Video downloading'
      | 'Media Converting'
      | 'Video encoding'
      | 'completed';
      progress: number,
    },
  },
};
