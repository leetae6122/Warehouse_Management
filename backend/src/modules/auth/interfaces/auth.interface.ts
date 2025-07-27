export interface ILoginResponse {
  accessToken: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    role: string;
  };
}

export interface IJwtPayload {
  id: number;
  username: string;
  role: string;
}
