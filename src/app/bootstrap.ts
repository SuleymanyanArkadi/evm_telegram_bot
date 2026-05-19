import { Bot } from 'grammy';
import { buildServer } from '../infra/http/server.js';
import { env } from '../shared/config/env.js';
import { logger } from '../infra/logger/logger.js';

async function main() {
  const bot = new Bot(env.BOT_TOKEN);

  bot.command('start', async (ctx) => {
    await ctx.reply('Бот запущен. Используйте /help');
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      [
        'Доступные команды:',
        '/start',
        '/help',
        '/add_contract',
        '/my_contracts',
        '/read',
        '/events',
        '/write',
        '/wallet',
        '/remove_wallet',
        '/history',
      ].join('\n'),
    );
  });

  const server = await buildServer();

  await server.listen({
    port: env.PORT,
    host: '0.0.0.0',
  });

  await bot.start();

  logger.info(`HTTP server started on port ${env.PORT}`);
  logger.info('Telegram bot started');
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});