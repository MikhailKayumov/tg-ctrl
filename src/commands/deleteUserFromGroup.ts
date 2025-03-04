import { mtprotoService } from '../services/mtprotoService';
import { Group } from './models';

export async function deleteUserFromGroup(group: Group, username: string): Promise<void> {
  const { users } = await mtprotoService.call('contacts.resolveUsername', { username });
  if (!users || !users.length) {
    console.log('Пользователь или бот не найден.');
    return;
  }

  try {
    if (group._ === 'chat') {
      await mtprotoService.call('messages.deleteChatUser', {
        chat_id: group.id,
        user_id: { _: 'inputUser', user_id: users[0].id },
        revoke_history: true,
      });
    } else {
      await mtprotoService.call('channels.banUser', {
        channel: { _: 'inputChannel', channel_id: group.id, access_hash: group.access_hash },
        participant: { _: 'inputPeerUser', user_id: users[0].id, access_hash: users[0].access_hash },
        banned_rights: { _: 'chatBannedRights', view_messages: true, until_date: 1 },
      });
    }

    console.log(`Пользователь ${username} удален из группы ${group.title}.`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Ошибка при удалении пользователя из группы ${group.title}:`, error.message);
  }
}
