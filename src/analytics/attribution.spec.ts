import { describe, expect, it } from 'vitest';
import { ATTRIBUTION_STORAGE_KEY, createAttributionTracker } from './attribution';

class MemoryStorage implements Storage {
  private readonly data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.data.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

const capture = (
  tracker: ReturnType<typeof createAttributionTracker>,
  url: string,
  referrer = '',
) => tracker.capture(new URL(url), referrer, 'algo.illegalscreed.cn');

describe('analytics session attribution', () => {
  it('TC-ATTR-UTM-125-03 first 固定，后续合法 campaign 只更新 current', () => {
    const storage = new MemoryStorage();
    const tracker = createAttributionTracker(storage);

    const first = capture(
      tracker,
      'https://algo.illegalscreed.cn/?utm_source=juejin&utm_medium=community&utm_campaign=launch-2026q3&utm_content=root',
    );
    expect(first).toEqual({
      version: 1,
      first: {
        source: 'juejin',
        medium: 'community',
        campaign: 'launch-2026q3',
        content: 'root',
      },
      current: {
        source: 'juejin',
        medium: 'community',
        campaign: 'launch-2026q3',
        content: 'root',
      },
    });

    const second = capture(
      tracker,
      'https://algo.illegalscreed.cn/docs/quick-sort?utm_source=v2ex&utm_medium=community&utm_campaign=launch-2026q3&utm_content=quick-sort',
    );
    expect(second.first).toEqual(first.first);
    expect(second.current).toEqual({
      source: 'v2ex',
      medium: 'community',
      campaign: 'launch-2026q3',
      content: 'quick-sort',
    });
    expect(JSON.parse(storage.getItem(ATTRIBUTION_STORAGE_KEY) ?? '{}')).toEqual(second);

    const campaignWithReferrer = createAttributionTracker(new MemoryStorage());
    const campaign = campaignWithReferrer.capture(
      new URL(
        'https://algo.illegalscreed.cn/?utm_source=chatgpt.com&utm_medium=ai-referral&utm_campaign=answer&utm_content=home',
      ),
      'https://chatgpt.com/c/private-id',
      'algo.illegalscreed.cn',
    );
    const afterSpaNavigation = campaignWithReferrer.capture(
      new URL('https://algo.illegalscreed.cn/docs/kmp'),
      'https://chatgpt.com/c/private-id',
      'algo.illegalscreed.cn',
    );
    expect(afterSpaNavigation.current).toEqual(campaign.current);
  });

  it('TC-ATTR-UTM-125-04 只保留外部 hostname，站内不覆盖，首次无来源为 direct', () => {
    const externalTracker = createAttributionTracker(new MemoryStorage());
    const external = capture(
      externalTracker,
      'https://algo.illegalscreed.cn/docs/dijkstra',
      'https://news.ycombinator.com/item?id=1',
    );
    expect(external.current).toEqual({
      source: 'news.ycombinator.com',
      medium: 'referral',
    });

    const internal = capture(
      externalTracker,
      'https://algo.illegalscreed.cn/docs/kmp',
      'https://algo.illegalscreed.cn/docs/dijkstra?input=secret',
    );
    expect(internal).toEqual(external);

    const direct = capture(
      createAttributionTracker(new MemoryStorage()),
      'https://algo.illegalscreed.cn/',
    );
    expect(direct.first).toEqual({ source: 'direct', medium: 'none' });
    expect(direct.current).toEqual(direct.first);

    const mirrorNavigation = createAttributionTracker(new MemoryStorage()).capture(
      new URL('https://illegalcreed.github.io/algorithms-visualization/'),
      'https://algo.illegalscreed.cn/docs/quick-sort?input=private',
      'illegalcreed.github.io',
    );
    expect(mirrorNavigation.current).toEqual({ source: 'direct', medium: 'none' });
  });

  it('TC-ATTR-UTM-125-05 ChatGPT UTM 与 referrer 都归一到 chatgpt.com', () => {
    const viaUtm = capture(
      createAttributionTracker(new MemoryStorage()),
      'https://algo.illegalscreed.cn/?utm_source=chatgpt.com&utm_medium=ai-referral&utm_campaign=answer-citation&utm_content=home',
    );
    expect(viaUtm.current.source).toBe('chatgpt.com');

    const viaReferrer = capture(
      createAttributionTracker(new MemoryStorage()),
      'https://algo.illegalscreed.cn/docs/binary-search',
      'https://chatgpt.com/c/opaque-conversation-id',
    );
    expect(viaReferrer.current).toEqual({ source: 'chatgpt.com', medium: 'referral' });
  });

  it('TC-ATTR-UTM-125-06 storage 抛错或损坏时使用内存并自愈', () => {
    const brokenStorage: Storage = {
      length: 0,
      clear: () => undefined,
      getItem: () => {
        throw new Error('blocked');
      },
      key: () => null,
      removeItem: () => undefined,
      setItem: () => {
        throw new Error('blocked');
      },
    };
    const blocked = createAttributionTracker(brokenStorage);
    const first = capture(
      blocked,
      'https://algo.illegalscreed.cn/?utm_source=x&utm_medium=social&utm_campaign=launch&utm_content=root',
    );
    const second = capture(blocked, 'https://algo.illegalscreed.cn/docs/kmp');
    expect(second).toEqual(first);

    const corruptedStorage = new MemoryStorage();
    corruptedStorage.setItem(ATTRIBUTION_STORAGE_KEY, '{not-json');
    const recovered = capture(
      createAttributionTracker(corruptedStorage),
      'https://algo.illegalscreed.cn/',
    );
    expect(recovered).toEqual({
      version: 1,
      first: { source: 'direct', medium: 'none' },
      current: { source: 'direct', medium: 'none' },
    });
    expect(JSON.parse(corruptedStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? '{}')).toEqual(
      recovered,
    );
  });
});
