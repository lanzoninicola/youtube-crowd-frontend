export interface UserInfoWithToken extends UserInfo {
  token: string;
}

export interface UserInfo {
  uid: string;
  email: string;
  name: string;
  provider: string;
  photoUrl: string;
}
