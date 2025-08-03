import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        // Nếu đã là HttpException thì throw trực tiếp
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // Xử lý các loại lỗi khác
        let message = 'Internal server error';
        if (typeof error === 'object' && error !== null && 'message' in error) {
          const errorMessage = (error as { message?: string }).message;
          if (errorMessage) {
            message = errorMessage;
          }
        }

        return throwError(() => new InternalServerErrorException(message));
      }),
    );
  }
}
