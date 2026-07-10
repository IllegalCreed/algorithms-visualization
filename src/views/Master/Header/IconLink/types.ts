export interface IconLink {
  url: string;
  src: string;
  title: string;
  share?: {
    channel: 'weibo' | 'x';
    path: string;
  };
}
