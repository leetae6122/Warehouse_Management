import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  MSG_EMPTY_COMPARE_DATA,
  MSG_EMPTY_HASH_DATA,
} from '../utils/message.util';

export const hashData = async (data: string): Promise<string> => {
  if (!data) {
    throw new BadRequestException(MSG_EMPTY_HASH_DATA);
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(data, salt);
};

export const compareHashedData = async (
  data: string,
  hashedData: string,
): Promise<boolean> => {
  if (!data || !hashedData) {
    throw new BadRequestException(MSG_EMPTY_COMPARE_DATA);
  }
  return await bcrypt.compare(data, hashedData);
};

export const hashTokenSHA256 = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const isJwtMatchHashed = (
  jwtToken: string,
  hashedToken: string,
): boolean => {
  const hashedInput = hashTokenSHA256(jwtToken);
  return hashedInput === hashedToken;
};
