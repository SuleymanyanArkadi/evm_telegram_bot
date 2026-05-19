import { describe, expect, it } from 'vitest';
import { validateAddress } from '../../helpers/validateAddress.js';
import { ContractValidationError } from '../../types/index.js';

describe('validateAddress', () => {
  it('accepts a valid EVM address', () => {
    expect(() => validateAddress('0x6b175474e89094c44da98b954eedeac495271d0f')).not.toThrow();
  });

  it('rejects an invalid EVM address', () => {
    expect(() => validateAddress('0x123')).toThrow(ContractValidationError);
  });

  it('rejects non-string values', () => {
    expect(() => validateAddress(123 as unknown)).toThrow(ContractValidationError);
  });
});
