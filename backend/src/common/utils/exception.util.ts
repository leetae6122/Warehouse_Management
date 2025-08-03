import { HttpException, InternalServerErrorException } from '@nestjs/common';

export interface ExceptionOptions {
  defaultMessage: string;
  entityName?: string;
}

/**
 * Xử lý exception một cách đơn giản và tái sử dụng
 * @param error - Lỗi được throw
 * @param options - Tùy chọn xử lý exception
 * @returns HttpException
 */
export function handleException(
  error: unknown,
  options: ExceptionOptions,
): HttpException {
  // Nếu đã là HttpException thì throw trực tiếp
  if (error instanceof HttpException) {
    return error;
  }

  // Lấy message từ error nếu có
  let message = options.defaultMessage;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const errorMessage = (error as { message?: string }).message;
    if (errorMessage) {
      message = errorMessage;
    }
  }

  return new InternalServerErrorException(message);
}
