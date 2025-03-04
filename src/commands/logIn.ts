import { prompt } from '../common/prompt';
import { mtprotoService } from '../services/mtprotoService';

export async function logIn(): Promise<void> {
  const phoneNumber = await prompt('Введите номер телефона: ');
  const { phone_code_hash } = await mtprotoService.call('auth.sendCode', {
    phone_number: phoneNumber,
    settings: { _: 'codeSettings' },
  });

  const code = await prompt('Введите код из Telegram: ');

  try {
    const { user } = await mtprotoService.call('auth.signIn', {
      phone_number: phoneNumber,
      phone_code_hash,
      phone_code: code,
    });

    console.log(`Авторизация успешна завершена для ${user.first_name}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === 'Method: auth.signIn, Error: SESSION_PASSWORD_NEEDED') {
      const password = await prompt('Введите пароль двухфакторной аутентификации: ');
      const passwordInfo = await mtprotoService.call('account.getPassword', {});
      const { srp_id, srp_B } = passwordInfo;
      const { g, p, salt1, salt2 } = passwordInfo.current_algo;
      const { A, M1 } = await mtprotoService.api.crypto.getSRPParams({ g, p, salt1, salt2, gB: srp_B, password });

      const checkPasswordResult = await mtprotoService.call('auth.checkPassword', {
        password: { _: 'inputCheckPasswordSRP', srp_id, A, M1 },
      });

      console.log(`Авторизация успешна завершена для ${checkPasswordResult.user.first_name}`);
    } else {
      throw error;
    }
  }
}
