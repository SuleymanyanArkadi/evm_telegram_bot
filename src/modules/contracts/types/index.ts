/**
 * Входные данные для создания контракта
 */
export interface CreateContractInput {
  userId: string;
  chainId: number;
  address: string;
  alias?: string;
  abiJson: unknown;
}

/**
 * Результат создания/получения контракта
 */
export interface ContractOutput {
  id: string;
  userId: string;
  chainId: number;
  address: string; // checksum format
  alias: string | null;
  abiJson: Record<string, unknown>[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Ошибка валидации контракта
 */
export class ContractValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContractValidationError';
  }
}
