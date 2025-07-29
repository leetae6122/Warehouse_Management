import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ClassType<T> = new (...args: any[]) => T;

@Injectable()
export class TransformDtoInterceptor<T> implements NestInterceptor {
  constructor(private readonly classType: ClassType<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (!response || typeof response !== 'object') {
          return response;
        }

        // Handle standard NestJS response format
        if ('data' in response) {
          return {
            ...response,
            data: this.transformData(response.data),
          };
        }

        // If response doesn't follow standard format, transform the entire response
        return this.transformData(response);
      }),
    );
  }

  private transformData(data: any): any {
    if (data === undefined || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return plainToInstance(this.classType, data);
    }

    return plainToInstance(this.classType, data);
  }
}