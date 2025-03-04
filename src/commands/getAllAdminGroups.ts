/* eslint-disable @typescript-eslint/no-explicit-any */
import { mtprotoService } from '../services/mtprotoService';
import { Group } from './models';

async function isAdminOrOwner(channel: any) {
  if (channel._ === 'chat') {
    return (
      channel.creator ||
      (channel.admin_rights &&
        channel.admin_rights.flags.includes('invite_users') &&
        channel.admin_rights.flags.includes('ban_users'))
    );
  }

  try {
    const { participant } = await mtprotoService.call('channels.getParticipant', {
      channel: { _: 'inputChannel', channel_id: channel.id, access_hash: channel.access_hash },
      participant: { _: 'inputPeerSelf' },
    });

    return (
      participant._ === 'channelParticipantAdmin' || // Администратор
      participant._ === 'channelParticipantCreator' // Владелец
    );
  } catch (error: any) {
    if (!error?.message.includes('USER_NOT_PARTICIPANT')) {
      console.error(`Ошибка при проверке прав в группе ${channel.title}:`, error?.message);
    }

    return false;
  }
}

export async function getAllAdminGroups(): Promise<Group[]> {
  const { chats } = await mtprotoService.call('messages.getDialogs', {
    limit: 500, // Максимальное количество диалогов
    offset_date: 0,
    offset_peer: { _: 'inputPeerEmpty' },
    offset_id: 0,
    hash: 0,
  });

  const groupChats = chats.filter((chat: any) => chat._ === 'chat' || (chat._ === 'channel' && chat.megagroup));

  const allAdminGroups: Group[] = [];
  for (const group of groupChats) {
    if (await isAdminOrOwner(group)) {
      allAdminGroups.push(group);
    }
  }

  return allAdminGroups;
}
