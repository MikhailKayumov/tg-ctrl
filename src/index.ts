import { addUserToGroup } from './commands/addUserToGroup';
import { deleteUserFromGroup } from './commands/deleteUserFromGroup';
import { getAllAdminGroups } from './commands/getAllAdminGroups';
import { logIn } from './commands/logIn';
import { logOut } from './commands/logOut';
import { beforeExit } from './common/beforeExit';
import { prompt } from './common/prompt';
import { mtprotoService } from './services/mtprotoService';

async function main(): Promise<void> {
  try {
    mtprotoService.initialize();

    await logIn();

    const groups = await getAllAdminGroups();
    if (!groups?.length) {
      console.log('У вас нет подвластных вам групп.');
      return;
    }

    console.log('Ваши группы:', groups?.length);

    const usernameToDelete = await prompt(
      'Введите username пользователя или бота для удаления (оставить пустым для пропуска): ',
    );
    if (usernameToDelete) {
      for (const group of groups) {
        await deleteUserFromGroup(group, usernameToDelete);
      }
    }

    const usernameToAdd = await prompt(
      'Введите username пользователя или бота для добавления (оставить пустым для пропуска): ',
    );
    if (usernameToAdd) {
      for (const group of groups) {
        await addUserToGroup(group, usernameToAdd);
      }
    }
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    try {
      await logOut();
    } catch (error) {
      /* empty */
    }
    beforeExit(); // Ожидание перед завершением
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

process.on('uncaughtException', (err) => {
  console.error('Необработанная ошибка:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Необработанное отклонение промиса:', reason);
});
