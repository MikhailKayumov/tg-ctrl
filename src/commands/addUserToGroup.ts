/* eslint-disable @typescript-eslint/no-explicit-any */
import { mtprotoService } from '../services/mtprotoService';
import { Group } from './models';

export async function addUserToGroup(group: Group, username: string): Promise<void> {
  const { users } = await mtprotoService.call('contacts.resolveUsername', { username });
  if (!users || !users.length) {
    console.log('Пользователь или бот не найден.');
    return;
  }

  try {
    if (group._ === 'chat') {
      await mtprotoService.call('messages.addChatUser', {
        chat_id: group.id,
        user_id: { _: 'inputUser', user_id: users[0].id, access_hash: users[0].access_hash },
        fwd_limit: 50,
      });
    } else {
      await mtprotoService.call('channels.inviteToChannel', {
        channel: { _: 'inputChannel', channel_id: group.id, access_hash: group.access_hash },
        users: [{ _: 'inputPeerUser', user_id: users[0].id, access_hash: users[0].access_hash }],
      });
    }
    console.log(`Пользователь ${username} добавлен в группу ${group.title}.`);
  } catch (error: any) {
    console.error(`Ошибка при добавлении пользователя в группу ${group.title}:`, error?.message);
  }
}
