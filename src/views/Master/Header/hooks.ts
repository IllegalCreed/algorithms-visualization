import type { IconLink } from "./IconLink/types";
import weiboIcon from '@/assets/weibo.svg';
import gitbubIcon from '@/assets/github.svg';
import twitterIcon from '@/assets/twitter.svg';

export function useIconLink(): IconLink[] {
  const iconLinkData: IconLink[] = [
    {
      title: 'github',
      src: gitbubIcon,
      url: 'https://www.github.com'
    },
    {
      title: 'twitter',
      src: twitterIcon,
      url: 'https://www.twitter.com'
    },
    {
      title: '新浪微博',
      src: weiboIcon,
      url: 'https://www.weibo.com'
    }
  ]

  return iconLinkData;
}