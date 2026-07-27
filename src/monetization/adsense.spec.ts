/// <reference types="node" />

import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ADSENSE_ACCOUNT_META_NAME,
  ADSENSE_CLIENT_ID,
  ADSENSE_SCRIPT_URL,
  ADS_TXT_RECORD,
} from './adsense';

const root = process.cwd();
const expectedClient = 'ca-pub-4047630223754404';
const expectedRecord = 'google.com, pub-4047630223754404, DIRECT, f08c47fec0942fa0';

function read(relativePath: string): string {
  const path = resolve(root, relativePath);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

describe('AdSense production readiness', () => {
  it('TC-ADS-ALGO-134-01: publisher constants and ads.txt stay aligned', () => {
    expect(ADSENSE_CLIENT_ID).toBe(expectedClient);
    expect(ADSENSE_ACCOUNT_META_NAME).toBe('google-adsense-account');
    expect(ADSENSE_SCRIPT_URL).toBe(
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${expectedClient}`,
    );
    expect(ADS_TXT_RECORD).toBe(expectedRecord);
    expect(read('public/ads.txt').trim()).toBe(expectedRecord);
  });

  it('TC-ADS-ALGO-134-02: Vite injects the account meta and loader only for builds', () => {
    const vite = read('vite.config.ts');
    expect(vite).toContain('adsenseHeadPlugin');
    expect(vite).toContain("config.command === 'build'");
    expect(vite).toContain('ADSENSE_ACCOUNT_META_NAME');
    expect(vite).toContain('ADSENSE_SCRIPT_URL');
    expect(vite).toContain("crossorigin: 'anonymous'");
  });

  it('TC-ADS-ALGO-134-03: prerender fulfils the external loader locally', () => {
    const prerender = read('scripts/prerender.mjs');
    expect(prerender).toContain("context.route('https://pagead2.googlesyndication.com/**'");
    expect(prerender).toContain("contentType: 'application/javascript'");
  });
});
