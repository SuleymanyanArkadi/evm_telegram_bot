import { ContractValidationError } from '../types/index.js';

/**
 * Валидирует ABI
 * @param abiJson - ABI для проверки
 * @throws ContractValidationError если ABI невалидный
 * @returns валидированный ABI как массив объектов
 */
export function validateAbi(abiJson: unknown): Record<string, unknown>[] {
  // Проверяем, что это массив
  if (!Array.isArray(abiJson)) {
    throw new ContractValidationError('ABI must be an array');
  }

  // Проверяем, что массив не пуст
  if (abiJson.length === 0) {
    throw new ContractValidationError('ABI array cannot be empty');
  }

  // Проверяем, что все элементы - объекты
  for (let i = 0; i < abiJson.length; i++) {
    const item = abiJson[i];
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new ContractValidationError(
        `ABI item at index ${i} must be an object`,
      );
    }
  }

  return abiJson as Record<string, unknown>[];
}
