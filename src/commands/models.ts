export interface Group {
  id: number;
  access_hash: string;
  title: string;
  participants?: {
    admin_rights?: {
      [key: string]: boolean;
    };
  };
  _: string;
}
