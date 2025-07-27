import { BadRequestException } from '@nestjs/common';
import { MSG_ERROR_CREATE_TOKEN, MSG_INVALID_TOKEN } from './message.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hashData } from './hash.util';
import { IJwtPayload } from 'src/modules/auth/interfaces/auth.interface';

const jwtService = new JwtService();
const configService = new ConfigService();

export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  RESET_PASS = 'RESET_PASS',
}

// export enum PathUrl {
//   FORGOT_PASSWORD = 'auth/reset-password',
// }

// export const getTokenUrl = (token: string, path: PathUrl) => {
//   return `${process.env.FRONTEND_URL}/${path}?token=${token}`;
// };

export const hashToken = async (token?: string | null) => {
  const tokenSlice = token ? token.slice(token.lastIndexOf('.')) : null;
  const tokenHashed = tokenSlice ? await hashData(tokenSlice) : null;
  return tokenHashed;
};

export const createJWT = (payload: IJwtPayload, typeToken: TokenType) => {
  try {
    if (configService.get(`EXPIRE_${typeToken}_JWT`)) {
      return jwtService.sign(payload, {
        secret: configService.get(`SECRET_${typeToken}_JWT`),
        expiresIn: configService.get(`EXPIRE_${typeToken}_JWT`),
      });
    } else {
      return jwtService.sign(payload, {
        secret: configService.get(`SECRET_${typeToken}_JWT`),
      });
    }
  } catch {
    throw new BadRequestException(MSG_ERROR_CREATE_TOKEN);
  }
};

export const verifyToken = (token: string, typeToken: TokenType) => {
  try {
    const decoded = jwtService.verify<IJwtPayload>(token, {
      secret: configService.get(`SECRET_${typeToken}_JWT`),
    });
    return decoded;
  } catch {
    throw new BadRequestException(MSG_INVALID_TOKEN);
  }
};
