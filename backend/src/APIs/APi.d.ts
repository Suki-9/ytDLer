type MimeTypes = {
  audio: 'audio/mp3' | 'audio/wav' | 'audio/flac' | 'audio/ogg';
  video: 'video/mp4' | 'video/avi';
};

type YtdlPayload = {
  url: string;
  id: string;
  options: {
    silent: boolean;
    mimeType: MimeTypes['audio'] | MimeTypes['video'];
  };
};

type YtdlResponse = {
  url: string;
  title: string;
  uploadDate: string;
  videoId: string;
  viewCount: string;
};
