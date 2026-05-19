import { describe, expect, it } from 'vitest';
import { validateAbi } from '../../helpers/validateAbi.js';
import { ContractValidationError } from '../../types/index.js';

describe('validateAbi', () => {
  it('accepts a non-empty array of ABI objects', () => {
    const abi = [{ type: 'function', name: 'transfer', inputs: [], outputs: [] }];

    expect(validateAbi(abi)).toEqual(abi);
  });

  it('rejects non-array input', () => {
    expect(() => validateAbi({ type: 'function' } as unknown)).toThrow(ContractValidationError);
  });

  it('rejects an empty array', () => {
    expect(() => validateAbi([])).toThrow('ABI array cannot be empty');
  });

  it('rejects arrays with non-object entries', () => {
    expect(() => validateAbi([{ type: 'function' }, null] as unknown)).toThrow(
      'ABI item at index 1 must be an object',
    );
  });
});
