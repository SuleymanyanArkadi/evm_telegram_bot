import { randomUUID } from 'node:crypto';
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import { ContractRepository } from '../../repository/ContractRepository.js';
import { createTestPrismaContext, closeTestPrismaContext, resetTestDatabase } from '../utils/prisma.js';

const testDatabaseUrl = process.env.TEST_DATABASE_URL?.trim();
const integrationSuite = testDatabaseUrl ? describe : describe.skip;

integrationSuite('ContractRepository integration', () => {
  const context = testDatabaseUrl ? createTestPrismaContext(testDatabaseUrl) : null;
  const prisma = context?.prisma;
  const repository = prisma ? new ContractRepository(prisma) : null;

  beforeAll(async () => {
    if (!prisma) {
      return;
    }

    await resetTestDatabase(prisma);
  });

  beforeEach(async () => {
    if (!prisma) {
      return;
    }

    await resetTestDatabase(prisma);
  });

  afterAll(async () => {
    if (!context) {
      return;
    }

    await resetTestDatabase(context.prisma);
    await closeTestPrismaContext(context);
  });

  it('createContract persists a contract', async () => {
    if (!prisma || !repository) {
      return;
    }

    const user = await prisma.user.create({
      data: {
        telegramId: `telegram-${randomUUID()}`,
        username: 'tester',
      },
    });

    const abiJson = [{ type: 'function', name: 'transfer', inputs: [], outputs: [] }];
    const created = await repository.createContract({
      userId: user.id,
      chainId: 1,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      alias: 'DAI',
      abiJson,
    });

    expect(created.userId).toBe(user.id);
    expect(created.chainId).toBe(1);
    expect(created.address).toBe('0x6B175474E89094C44Da98b954EedeAC495271d0F');
    expect(created.alias).toBe('DAI');
    expect(created.abiJson).toEqual(abiJson);

    const stored = await prisma.userContract.findUnique({ where: { id: created.id } });
    expect(stored).not.toBeNull();
    expect(stored?.address).toBe(created.address);
  });

  it('getContractsByUserId returns all user contracts', async () => {
    if (!prisma || !repository) {
      return;
    }

    const user = await prisma.user.create({
      data: {
        telegramId: `telegram-${randomUUID()}`,
      },
    });

    const first = await repository.createContract({
      userId: user.id,
      chainId: 1,
      address: '0x000000000000000000000000000000000000dEaD',
      alias: 'First',
      abiJson: [{ type: 'function', name: 'approve', inputs: [], outputs: [] }],
    });

    const second = await repository.createContract({
      userId: user.id,
      chainId: 56,
      address: '0x000000000000000000000000000000000000bEEF',
      alias: 'Second',
      abiJson: [{ type: 'function', name: 'transfer', inputs: [], outputs: [] }],
    });

    const contracts = await repository.getContractsByUserId(user.id);

    expect(contracts).toHaveLength(2);
    expect(contracts.map((contract) => contract.id)).toEqual([second.id, first.id]);
    expect(contracts.every((contract) => contract.userId === user.id)).toBe(true);
  });

  it('getContractById returns a single contract', async () => {
    if (!prisma || !repository) {
      return;
    }

    const user = await prisma.user.create({
      data: {
        telegramId: `telegram-${randomUUID()}`,
      },
    });

    const created = await repository.createContract({
      userId: user.id,
      chainId: 137,
      address: '0x000000000000000000000000000000000000c0Fe',
      alias: 'Polygon Contract',
      abiJson: [{ type: 'function', name: 'balanceOf', inputs: [], outputs: [] }],
    });

    const found = await repository.getContractById(created.id);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
    expect(found?.userId).toBe(user.id);
    expect(found?.chainId).toBe(137);
    expect(found?.address).toBe(created.address);
  });
});
