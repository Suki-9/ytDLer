type YtdlPayload = {
  url: string;
  id: string;
  options: {
    silent: boolean;
    soundOnly: boolean;
    mimeType: string;
  };
};
