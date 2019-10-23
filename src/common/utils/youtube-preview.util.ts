export const getPreviewFromVideoLink = (videoLink: string): string => {
  if (videoLink.includes('youtu.be')) {
    const videoId = new URL(videoLink).pathname;
    return `https://img.youtube.com/vi${videoId}/0.jpg`;
  }
  return 'unknown';
};
