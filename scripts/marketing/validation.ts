const UNSAFE_FIELD_PATTERN =
  /password|passphrase|token|cookie|secret|script|selector|storage.?state|profile|credential/i;

export class MarketingInputError extends TypeError {
  constructor(message: string) {
    super(message);
    this.name = 'MarketingInputError';
  }
}

export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value) as unknown;
  return prototype === Object.prototype || prototype === null;
}

export function requirePlainRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isPlainRecord(value)) throw new MarketingInputError(`${path} must be an object`);
  return value;
}

export function assertNoUnsafeFields(value: unknown, path = 'input'): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoUnsafeFields(item, `${path}[${index}]`));
    return;
  }
  if (!isPlainRecord(value)) return;

  for (const [key, child] of Object.entries(value)) {
    if (UNSAFE_FIELD_PATTERN.test(key)) {
      throw new MarketingInputError(`Unsafe field "${key}" at ${path}`);
    }
    assertNoUnsafeFields(child, `${path}.${key}`);
  }
}

export function assertExactKeys(
  value: Record<string, unknown>,
  allowed: readonly string[],
  path: string,
): void {
  const allowedKeys = new Set(allowed);
  const unexpected = Object.keys(value).filter((key) => !allowedKeys.has(key));
  if (unexpected.length > 0) {
    throw new MarketingInputError(`Unexpected field "${unexpected[0]}" at ${path}`);
  }
}

export function requireString(
  value: unknown,
  path: string,
  options: { maxLength: number; allowNewlines?: boolean },
): string {
  if (typeof value !== 'string') throw new MarketingInputError(`${path} must be a string`);
  const normalized = value.trim().replace(/\r\n?/g, '\n');
  if (!normalized) throw new MarketingInputError(`${path} must not be empty`);
  if (normalized.length > options.maxLength) {
    throw new MarketingInputError(`${path} exceeds ${options.maxLength} characters`);
  }
  if (!options.allowNewlines && /[\r\n]/.test(normalized)) {
    throw new MarketingInputError(`${path} must be one line`);
  }
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(normalized)) {
    throw new MarketingInputError(`${path} contains control characters`);
  }
  return normalized;
}

export function requireBoolean(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') throw new MarketingInputError(`${path} must be a boolean`);
  return value;
}
