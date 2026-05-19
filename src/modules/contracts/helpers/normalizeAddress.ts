import { getAddress } from 'ethers';

/**
 * Нормализирует адрес в checksum формат
 * @param address - адрес для нормализации
 * @returns адрес в checksum формате
 */
export function normalizeAddress(address: string): string {
  return getAddress(address);
}
