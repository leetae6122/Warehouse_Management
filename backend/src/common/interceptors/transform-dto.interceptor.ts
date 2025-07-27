import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { Observable, firstValueFrom, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

interface ResponseData<T> {
  statusCode: number;
  message: string;
  data: T | T[];
}

@Injectable()
export class TransformDtoInterceptor<T>
  implements NestInterceptor<T, ResponseData<T>>
{
  constructor(private readonly classType: ClassConstructor<T>) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<ResponseData<T>>> {
    return next.handle().pipe(
      switchMap(async (response: ResponseData<T>) => {
        try {
          if (!response || !response.data) {
            return response;
          }

          // Xử lý mảng dữ liệu
          if (Array.isArray(response.data)) {
            response.data = await this.transformArray(response.data);
            return response;
          }

          // Xử lý object đơn lẻ
          response.data = this.transformObject(response.data);
          return response;
        } catch (error) {
          throw new InternalServerErrorException(
            'Lỗi trong quá trình transform dữ liệu',
          );
        }
      }),
      catchError((error) => {
        throw new InternalServerErrorException(
          `Lỗi transform DTO: ${error.message}`,
        );
      }),
    );
  }

  private async transformArray(data: T[]): Promise<T[]> {
    return firstValueFrom(
      of(data).pipe(
        map((items) => items.map((item) => this.transformObject(item))),
      ),
    );
  }

  private transformObject(data: T): T {
    return plainToClass(this.classType, data, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
