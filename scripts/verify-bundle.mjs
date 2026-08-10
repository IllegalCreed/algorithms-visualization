import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const dist = path.join(root, 'dist');

function fail(message) {
  throw new Error(`[verify-bundle] ${message}`);
}

function read(relativePath) {
  const file = path.join(dist, relativePath);
  if (!fs.existsSync(file)) fail(`missing ${relativePath}; run the production build first`);
  return fs.readFileSync(file);
}

function assetRelativePath(url) {
  const pathname = new URL(url, 'https://bundle.invalid').pathname;
  const assetsIndex = pathname.lastIndexOf('/assets/');
  if (assetsIndex < 0) fail(`unexpected asset URL: ${url}`);
  return pathname.slice(assetsIndex + 1);
}

function javascriptAssets(html) {
  return [...new Set([...html.matchAll(/(?:href|src)="([^"]+\.js)"/g)].map((match) => match[1]))];
}

function gzipSize(buffer) {
  return zlib.gzipSync(buffer).byteLength;
}

const englishHtml = read('en/docs/knapsack/index.html').toString('utf8');
const englishPreloads = (englishHtml.match(/rel="modulepreload"/g) ?? []).length;
if (englishPreloads > 12) {
  fail(`English representative page preloads ${englishPreloads} modules (budget: 12)`);
}

const englishAssets = javascriptAssets(englishHtml);
const englishGzip = englishAssets.reduce(
  (total, url) => total + gzipSize(read(assetRelativePath(url))),
  0,
);
if (englishGzip > 250_000) {
  fail(`English representative JS is ${englishGzip} gzip bytes (budget: 250000)`);
}

const indexHtml = read('index.html').toString('utf8');
const entryUrl = indexHtml.match(/<script[^>]+src="([^"]+\.js)"/)?.[1];
if (!entryUrl) fail('cannot find the application entry script');
const entryGzip = gzipSize(read(assetRelativePath(entryUrl)));
if (entryGzip > 130_000) {
  fail(`application entry is ${entryGzip} gzip bytes (budget: 130000)`);
}

const css = fs
  .readdirSync(path.join(dist, 'assets'))
  .filter((file) => file.endsWith('.css'))
  .map((file) => read(path.join('assets', file)).toString('utf8'))
  .join('\n');

for (const selector of ['row', 'column', 'btn']) {
  const count = (css.match(new RegExp(`(?:^|})\\.${selector}\\{`, 'g')) ?? []).length;
  if (count > 1) fail(`global .${selector} utility is emitted ${count} times (budget: 1)`);
}

console.log(
  `[verify-bundle] ok: en preloads=${englishPreloads}, en JS gzip=${englishGzip}, entry gzip=${entryGzip}`,
);
