export interface UsersAttributes {
  id: number;
  login_id: string;
  password: string | null;
  name: string;
  phone: string;
  wrong_num: number;
  nickname: string;
  profile_path: string;
  // license_id: number;
  type: boolean;
};