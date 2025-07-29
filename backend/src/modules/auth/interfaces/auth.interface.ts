export interface ILoginResponse {
  accessToken: string;
  refreshToken?: string;
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

export interface IVerifyJwtPayload extends IJwtPayload {
  iat?: number;
  exp?: number;
}
