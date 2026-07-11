export function makeCampaignSpec(): Record<string, unknown> {
  return {
    schemaVersion: 1,
    id: 'quick-sort-launch',
    topic: 'Quick Sort visualization launch',
    targetUrls: [
      'https://algo.illegalscreed.cn/',
      'https://algo.illegalscreed.cn/docs/quick-sort?input=9,5,1#player',
    ],
    locales: ['zh-CN', 'en'],
    channels: ['github', 'weibo', 'bluesky', 'dev', 'mastodon'],
    publishAt: '2026-07-12T20:00:00+09:00',
    campaign: 'launch-2026q3',
    content: {
      variants: {
        'zh-CN': {
          title: '快速排序可视化已上线',
          angle: '逐步观察分区、枢轴落位和区间栈变化。',
          callToAction: '打开可视化',
        },
        en: {
          title: 'Quick Sort visualization is live',
          angle: 'Trace partitioning, pivot placement, and the explicit interval stack.',
          callToAction: 'Open the visualization',
        },
      },
      media: ['image'],
    },
    replies: {
      mode: 'faq-only',
      createBugIssues: true,
    },
    failureMode: 'continue-supported',
  };
}

export const READY_RUNTIME_STATE = Object.freeze({
  executionApproved: true,
  adapterReady: true,
  authorized: true,
  quotaAvailable: true,
});
