# Contracts Module

Модуль для управления Smart Contract'ами пользователей в telegram боте на EVM.

## Структура

```
contracts/
├── types/
│   └── index.ts              # Типы данных и интерфейсы
├── helpers/
│   ├── validateAddress.ts    # Валидация EVM адреса
│   ├── validateAbi.ts        # Валидация ABI
│   └── normalizeAddress.ts   # Нормализация адреса в checksum формат
├── repository/
│   └── ContractRepository.ts # Работа с БД (Prisma)
├── service/
│   └── ContractService.ts    # Бизнес-логика
├── initialization.ts         # Инициализация модуля
├── index.ts                  # Экспорт публичного API
└── README.md
```

## Типы данных

### CreateContractInput
Входные данные для создания контракта:
```typescript
{
  userId: string;          // ID пользователя
  chainId: number;         // ID блокчейна (1 = Ethereum, 56 = BSC, и т.д.)
  address: string;         // EVM адрес контракта
  alias?: string;          // Необязательный alias контракта
  abiJson: unknown;        // ABI контракта (будет валидирован как JSON array)
}
```

### ContractOutput
Результат операций с контрактом:
```typescript
{
  id: string;              // ID контракта в БД
  userId: string;          // ID пользователя
  chainId: number;         // ID блокчейна
  address: string;         // Адрес в checksum формате
  alias: string | null;    // Alias контракта
  abiJson: Record<string, unknown>[]; // Валидированный ABI
  createdAt: Date;         // Дата создания
  updatedAt: Date;         // Дата обновления
}
```

### ContractValidationError
Ошибка валидации контракта. Наследуется от `Error`.

## API

### ContractService

#### createContract(input: CreateContractInput): Promise<ContractOutput>
Создаёт новый контракт с валидацией:
- Проверяет, что адрес - валидный EVM адрес
- Проверяет, что ABI - валидный JSON array объектов
- Нормализирует адрес в checksum формат
- Сохраняет контракт в БД

Может выбросить `ContractValidationError`.

```typescript
const contract = await contractService.createContract({
  userId: 'user-123',
  chainId: 1,
  address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  alias: 'DAI Token',
  abiJson: [
    { type: 'function', name: 'transfer', inputs: [...] },
    // ...
  ],
});
```

#### getContractsByUserId(userId: string): Promise<ContractOutput[]>
Получает все контракты пользователя (отсортированы по дате создания, новые первыми).

```typescript
const userContracts = await contractService.getContractsByUserId('user-123');
```

#### getContractById(contractId: string): Promise<ContractOutput | null>
Получает контракт по ID, или `null` если не найден.

```typescript
const contract = await contractService.getContractById('contract-id');
if (contract) {
  console.log(contract.address);
}
```

### ContractRepository

Низкоуровневый доступ к БД. Используется ContractService, но может быть полезен для дополнительных операций.

## Helpers

### validateAddress(address: unknown): void
Валидирует EVM адрес. Выбрасывает `ContractValidationError` если адрес невалидный.

```typescript
try {
  validateAddress('0x123'); // Неполный адрес
} catch (e) {
  console.error(e.message); // Invalid EVM address
}
```

### validateAbi(abiJson: unknown): Record<string, unknown>[]
Валидирует ABI как JSON array объектов. Выбрасывает `ContractValidationError` если невалидно.

```typescript
try {
  const abi = validateAbi([
    { type: 'function', name: 'transfer' }
  ]);
} catch (e) {
  console.error(e.message);
}
```

### normalizeAddress(address: string): string
Нормализирует адрес в checksum формат.

```typescript
const checksum = normalizeAddress('0x6b175474e89094c44da98b954eedeac495271d0f');
// => 0x6B175474E89094C44Da98b954EedeAC495271d0F
```

## Инициализация

В файле `initialization.ts` есть функция `initializeContractsModule()` которая возвращает инициализированные `contractService` и `contractRepository`:

```typescript
import { initializeContractsModule } from './modules/contracts/initialization.js';

const { contractService } = initializeContractsModule();
```

## Интеграция с Bot

В будущем модуль будет интегрирован с bot commands и scenes:
- Команда для добавления контракта
- Команда для просмотра списка контрактов
- Команда для выполнения операций с контрактом
- Сцены для интерактивного добавления контрактов

Текущая структура готова для этого расширения.

## Примечания

- Все адреса автоматически конвертируются в checksum формат (на основе EIP-55)
- ABI хранится как JSON в БД
- Модуль использует ethers.js для валидации адресов
- Модуль использует Prisma для доступа к БД
