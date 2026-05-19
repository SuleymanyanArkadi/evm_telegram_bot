import { isAddress } from 'ethers';
import { ContractValidationError } from '../types/index.js';

/**
 * Валидирует EVM адрес
 * @param address - адрес для проверки
 * @throws ContractValidationError если адрес невалидный
 */
export function validateAddress(address: unknown): void {
  if (typeof address !== 'string') {
    throw new ContractValidationError('Address must be a string');
  }

  if (!isAddress(address)) {
    throw new ContractValidationError(`Invalid EVM address: ${address}`);
  }
}
