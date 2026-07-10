import { buildCampaignUrl } from '../src/analytics/utm.ts';

const OPTION_NAMES = ['url', 'source', 'medium', 'campaign', 'content'] as const;
type OptionName = (typeof OPTION_NAMES)[number];

function usage(): string {
  return [
    'Usage:',
    '  pnpm marketing:link -- --url <https-url> --source <source> --medium <medium> \\',
    '    --campaign <campaign> --content <content>',
  ].join('\n');
}

function parseOptions(argv: string[]): Record<OptionName, string> {
  const values = new Map<OptionName, string>();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--') continue;
    if (!token.startsWith('--')) continue;
    const name = token.slice(2) as OptionName;
    if (!OPTION_NAMES.includes(name)) throw new TypeError(`Unknown option: ${token}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new TypeError(`Missing value for ${token}`);
    values.set(name, value);
    index += 1;
  }

  const missing = OPTION_NAMES.filter((name) => !values.has(name));
  if (missing.length) throw new TypeError(`Missing options: ${missing.join(', ')}`);
  return Object.fromEntries(values) as Record<OptionName, string>;
}

try {
  if (process.argv.includes('--help')) {
    process.stdout.write(`${usage()}\n`);
  } else {
    const options = parseOptions(process.argv.slice(2));
    const result = buildCampaignUrl(options.url, {
      source: options.source,
      medium: options.medium,
      campaign: options.campaign,
      content: options.content,
    });
    process.stdout.write(`${result}\n`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n\n${usage()}\n`);
  process.exitCode = 1;
}
