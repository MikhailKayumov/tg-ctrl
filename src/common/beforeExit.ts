import * as readline from 'readline';

export const beforeExit = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Нажмите Enter, чтобы выйти...', () => {
    rl.close();
  });
};
