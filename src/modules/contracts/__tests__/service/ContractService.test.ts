import { getAddress } from 'ethers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ContractService } from '../../service/ContractService.js';
import { ContractValidationError } from '../../types/index.js';

function createRepositoryMock() {
  return {
    createContract: vi.fn(),
    getContractsByUserId: vi.fn(),
    getContractById: vi.fn(),
  };
}

describe('ContractService', () => {
  let repositoryMock: ReturnType<typeof createRepositoryMock>;
  let service: ContractService;

  beforeEach(() => {
    repositoryMock = createRepositoryMock();
    service = new ContractService(repositoryMock as never);
  });

  it('validates address and ABI, normalizes address, and calls repository', async () => {
    const input = {
      userId: 'user-1',
      chainId: 1,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      alias: 'DAI',
      abiJson: [{ type: 'function', name: 'transfer', inputs: [], outputs: [] }],
    };
    const normalizedAddress = getAddress(input.address);
    const storedContract = {
      id: 'contract-1',
      userId: input.userId,
      chainId: input.chainId,
      address: normalizedAddress,
      alias: input.alias ?? null,
      abiJson: input.abiJson,
      createdAt: new Date('2026-05-19T00:00:00.000Z'),
      updatedAt: new Date('2026-05-19T00:00:00.000Z'),
    };

    repositoryMock.createContract.mockResolvedValue(storedContract);

    const result = await service.createContract(input);

    expect(repositoryMock.createContract).toHaveBeenCalledTimes(1);
    expect(repositoryMock.createContract).toHaveBeenCalledWith({
      userId: input.userId,
      chainId: input.chainId,
      address: normalizedAddress,
      alias: input.alias,
      abiJson: input.abiJson,
    });
    expect(result).toEqual(storedContract);
  });

  it('throws ContractValidationError on invalid address', async () => {
    await expect(
      service.createContract({
        userId: 'user-1',
        chainId: 1,
        address: '0x123',
        alias: 'Broken',
        abiJson: [{ type: 'function', name: 'transfer' }],
      }),
    ).rejects.toBeInstanceOf(ContractValidationError);

    expect(repositoryMock.createContract).not.toHaveBeenCalled();
  });

  it('throws ContractValidationError on invalid ABI', async () => {
    await expect(
      service.createContract({
        userId: 'user-1',
        chainId: 1,
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        alias: 'Broken',
        abiJson: 'not-an-abi',
      }),
    ).rejects.toBeInstanceOf(ContractValidationError);

    expect(repositoryMock.createContract).not.toHaveBeenCalled();
  });

  it('delegates getContractsByUserId to repository', async () => {
    const contracts = [{ id: 'contract-1' }];
    repositoryMock.getContractsByUserId.mockResolvedValue(contracts);

    await expect(service.getContractsByUserId('user-1')).resolves.toEqual(contracts);
    expect(repositoryMock.getContractsByUserId).toHaveBeenCalledWith('user-1');
  });

  it('delegates getContractById to repository', async () => {
    const contract = { id: 'contract-1' };
    repositoryMock.getContractById.mockResolvedValue(contract);

    await expect(service.getContractById('contract-1')).resolves.toEqual(contract);
    expect(repositoryMock.getContractById).toHaveBeenCalledWith('contract-1');
  });
});
