type Endpoints = {
  'youtube-dl': {
    req: {
      id: string;
      url: string;
      options: Record<string, boolean>;
    },
    res: {
      msg: string;
      url: string;
      title: string;
      uploadDate: string;
      videoId: string;
      viewCount: string;
    },
  }
}
