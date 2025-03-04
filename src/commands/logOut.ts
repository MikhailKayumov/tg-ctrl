import { mtprotoService } from '../services/mtprotoService';

export async function logOut(): Promise<void> {
  try {
    await mtprotoService.call('auth.logOut', {});
    console.log('Сессия пользователя успешно закрыта.');
  } catch (error) {
    console.error('Ошибка при закрытии сессии:', error);
  }
}
