import { ContractRepository } from '../repository/ContractRepository.js';
import {
  CreateContractInput,
  ContractOutput,
  ContractValidationError,
} from '../types/index.js';
import { validateAddress } from '../helpers/validateAddress.js';
import { normalizeAddress } from '../helpers/normalizeAddress.js';
import { validateAbi } from '../helpers/validateAbi.js';

/**
 * Service для управления контрактами
 * Отвечает за бизнес-логику: валидацию и сохранение контрактов
 */
export class ContractService {
  constructor(private repository: ContractRepository) {}

  /**
   * Создаёт новый контракт с валидацией
   * @param input - входные данные
   * @throws ContractValidationError если данные невалидные
   */
  async createContract(input: CreateContractInput): Promise<ContractOutput> {
    // Валидируем адрес
    validateAddress(input.address);

    // Валидируем ABI
    const validatedAbi = validateAbi(input.abiJson);

    // Нормализируем адрес в checksum формат
    const normalizedAddress = normalizeAddress(input.address);

    // Сохраняем контракт через repository
    const contract = await this.repository.createContract({
      userId: input.userId,
      chainId: input.chainId,
      address: normalizedAddress,
      alias: input.alias,
      abiJson: validatedAbi,
    });

    return contract;
  }

  /**
   * Получает контракты пользователя
   */
  async getContractsByUserId(userId: string): Promise<ContractOutput[]> {
    return this.repository.getContractsByUserId(userId);
  }

  /**
   * Получает контракт по ID
   */
  async getContractById(contractId: string): Promise<ContractOutput | null> {
    return this.repository.getContractById(contractId);
  }
}
