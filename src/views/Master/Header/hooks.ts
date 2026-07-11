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
  ENGLISH_SHARE_TEXT,
  SHARE_TEXT,
  buildShareTargetUrl,
  buildWeiboShareUrl,
  buildXShareUrl,
} from './share';
import { siteLocaleFromPath } from '@/i18n/catalog';

export function useIconLink(): ComputedRef<IconLink[]> {
  const route = useRoute();
  return computed(() => {
    const target = buildShareTargetUrl(route.fullPath);
    const english = siteLocaleFromPath(route.path) === 'en';
    const shareText = english ? ENGLISH_SHARE_TEXT : SHARE_TEXT;
    return [
      {
        title: english ? 'Share on Weibo' : '分享到微博',
        src: weiboIcon,
        url: buildWeiboShareUrl(target, shareText),
      },
      {
        title: english ? 'Share on X' : '分享到 X',
        src: twitterIcon,
        url: buildXShareUrl(target, shareText),
      },
      {
        title: english ? 'GitHub repository' : 'GitHub 仓库',
        src: githubIcon,
        url: GITHUB_REPO_URL,
      },
      { title: english ? 'Author website' : '个人主页', src: homepageIcon, url: HOME_PAGE_URL },
    ];
  });
}
