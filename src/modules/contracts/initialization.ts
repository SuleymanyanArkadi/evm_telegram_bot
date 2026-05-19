/**
 * Пример инициализации и использования Contracts Module
 *
 * Этот файл показывает, как инициализировать и использовать контрактный модуль.
 * В дальнейшем этот код будет интегрирован в bot bootstrap и commands.
 */

import { prisma } from '../../infra/db/prisma.js';
import { ContractRepository } from './repository/ContractRepository.js';
import { ContractService } from './service/ContractService.js';

// ИнициализацияRepository и Service
export function initializeContractsModule() {
  const contractRepository = new ContractRepository(prisma);
  const contractService = new ContractService(contractRepository);

  return {
    contractService,
    contractRepository,
  };
}

/**
 * Пример использования:
 *
 * // Инициализируем модуль
 * const { contractService } = initializeContractsModule();
 *
 * // Создаём контракт
 * const newContract = await contractService.createContract({
 *   userId: 'user-123',
 *   chainId: 1,
 *   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI на Ethereum
 *   alias: 'DAI Token',
 *   abiJson: [
 *     { type: 'function', name: 'transfer', inputs: [...], outputs: [...] },
 *     // ... другие элементы ABI
 *   ],
 * });
 *
 * // Получаем контракты пользователя
 * const userContracts = await contractService.getContractsByUserId('user-123');
 *
 * // Получаем конкретный контракт
 * const contract = await contractService.getContractById(newContract.id);
 */
