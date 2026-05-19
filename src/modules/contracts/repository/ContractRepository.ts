import { PrismaClient } from '@prisma/client';
import { ContractOutput } from '../types/index.js';

/**
 * Repository для управления контрактами в БД
 */
export class ContractRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Создаёт новый контракт
   */
  async createContract(data: {
    userId: string;
    chainId: number;
    address: string;
    alias?: string;
    abiJson: Record<string, unknown>[];
  }): Promise<ContractOutput> {
    const contract = await this.prisma.userContract.create({
      data: {
        userId: data.userId,
        chainId: data.chainId,
        address: data.address,
        alias: data.alias || null,
        abiJson: data.abiJson as any,
      },
    });

    return this.mapToOutput(contract);
  }

  /**
   * Получает контракты по userId
   */
  async getContractsByUserId(userId: string): Promise<ContractOutput[]> {
    const contracts = await this.prisma.userContract.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return contracts.map((c) => this.mapToOutput(c));
  }

  /**
   * Получает контракт по ID
   */
  async getContractById(contractId: string): Promise<ContractOutput | null> {
    const contract = await this.prisma.userContract.findUnique({
      where: { id: contractId },
    });

    return contract ? this.mapToOutput(contract) : null;
  }

  /**
   * Маппирует Prisma модель в ContractOutput
   */
  private mapToOutput(contract: {
    id: string;
    userId: string;
    chainId: number;
    address: string;
    alias: string | null;
    abiJson: unknown;
    createdAt: Date;
    updatedAt: Date;
  }): ContractOutput {
    return {
      id: contract.id,
      userId: contract.userId,
      chainId: contract.chainId,
      address: contract.address,
      alias: contract.alias,
      abiJson: contract.abiJson as Record<string, unknown>[],
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
    };
  }
}
