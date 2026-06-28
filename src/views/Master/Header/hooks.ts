import { computed, type ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import type { IconLink } from './IconLink/types';
import weiboIcon from '@/assets/weibo.svg';
import githubIcon from '@/assets/github.svg';
import twitterIcon from '@/assets/twitter.svg';
import homepageIcon from '@/assets/homepage.svg';
import {
  GITHUB_REPO_URL,
  HOME_PAGE_URL,
  SHARE_TEXT,
  buildShareTargetUrl,
  buildWeiboShareUrl,
  buildXShareUrl,
} from './share';

export function useIconLink(): ComputedRef<IconLink[]> {
  const route = useRoute();
  return computed(() => {
    const target = buildShareTargetUrl(route.fullPath);
    return [
      { title: '分享到微博', src: weiboIcon, url: buildWeiboShareUrl(target, SHARE_TEXT) },
      { title: '分享到 X', src: twitterIcon, url: buildXShareUrl(target, SHARE_TEXT) },
      { title: 'GitHub 仓库', src: githubIcon, url: GITHUB_REPO_URL },
      { title: '个人主页', src: homepageIcon, url: HOME_PAGE_URL },
    ];
  });
}
