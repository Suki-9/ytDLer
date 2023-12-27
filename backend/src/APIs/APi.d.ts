type YtdlPayload = {
  url: string;
  id: string;
  options: {
    silent: boolean;
    soundOnly: boolean;
    mimeType: string;
  };
};

type YtdlResponse = {
  url: string;
  title: string;
  uploadDate: string;
  videoId: string;
  viewCount: string;
};
