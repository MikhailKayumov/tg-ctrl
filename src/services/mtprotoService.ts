/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import MTProto = require('@mtproto/core');
import { HandledError } from '../common/handledError';
import { HttpStatusCode } from '../common/httpStatusCode';
import { sleep } from '../common/sleep';

const API_ID = parseInt(process.env.API_ID || '');
const API_HASH = process.env.API_HASH || '';

export class MTProtoService {
  public api: any;

  public initialize() {
    if (!this.api) {
      this.api = new MTProto({
        api_id: API_ID,
        api_hash: API_HASH,
        storageOptions: {
          path: path.resolve(process.cwd(), './mtprotoData/1.json'),
        },
      });
    }
  }

  public async call(method: string, params: any, options = {}): Promise<any> {
    try {
      const result = await this.api.call(method, params, options);

      return result;
    } catch (error: any) {
      const { error_code, error_message } = error;

      // if too many requests / call query after flood_wait
      if (error_code === HttpStatusCode.enhanceYourCalm) {
        const seconds = Number(error_message.split('FLOOD_WAIT_')[1]);
        const ms = seconds * 1000;

        await sleep(ms);

        return this.call(method, params, options);
      }

      if (error_code === HttpStatusCode.seeOther) {
        const [type, dcIdAsString] = error_message.split('_MIGRATE_');

        const dcId = Number(dcIdAsString);

        // If auth.sendCode call on incorrect DC need change default DC, because
        // call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
        if (type === 'PHONE') {
          await this.api.setDefaultDc(dcId);
        } else {
          Object.assign(options, { dcId });
        }

        return this.call(method, params, options);
      }

      return Promise.reject(new HandledError(error_code, `Method: ${method}, Error: ${error_message}`));
    }
  }
}

export const mtprotoService = new MTProtoService();
