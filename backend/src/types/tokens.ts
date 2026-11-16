export type refreshTokenModel = {
  user_id: number;
  refresh_token_hash: string;
  created_at: Date;
  expires_at: Date;
};
