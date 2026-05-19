import { describe, expect, it } from 'vitest';
import { normalizeAddress } from '../../helpers/normalizeAddress.js';

describe('normalizeAddress', () => {
  it('returns checksum address', () => {
    expect(normalizeAddress('0x6b175474e89094c44da98b954eedeac495271d0f')).toBe(
      '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    );
  });

  it('throws for an invalid address', () => {
    expect(() => normalizeAddress('0x123')).toThrow();
  });
});
