/** 线上自有域名（selfhost 根部署，base=/）—— 分享链接统一指向这里 */
export const SITE_ORIGIN = 'https://algo.illegalscreed.cn';
/** 本项目 GitHub 仓库（取自 git remote origin） */
export const GITHUB_REPO_URL = 'https://github.com/IllegalCreed/algorithms-visualization';
/** 作者个人主页（C-030 增：头部「个人主页」外链指向这里） */
export const HOME_PAGE_URL = 'https://illegalscreed.cn/zh/';
/** 分享文案：标题 + 一句简介 */
export const SHARE_TEXT = '算法可视化 —— 交互式数据结构与算法可视化';
export const ENGLISH_SHARE_TEXT =
  'Algorithm Visualizer - interactive data structures and algorithms, step by step';

/** 当前路由 fullPath（不含 base，形如 /sort/bubble-sort）→ 线上规范完整 URL */
export function buildShareTargetUrl(fullPath: string): string {
  return `${SITE_ORIGIN}${fullPath}`;
}

/** 微博分享 intent URL */
export function buildWeiboShareUrl(targetUrl: string, text: string): string {
  const qs = new URLSearchParams({ url: targetUrl, title: text });
  return `https://service.weibo.com/share/share.php?${qs.toString()}`;
}

/** X（原 Twitter）分享 intent URL */
export function buildXShareUrl(targetUrl: string, text: string): string {
  const qs = new URLSearchParams({ url: targetUrl, text });
  return `https://twitter.com/intent/tweet?${qs.toString()}`;
}
