import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  result: T;
  statusCode: number;
  message?: string;
  error?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle()
      .pipe(map(result => {
        return ({
          result,
          statusCode: context.switchToHttp().getResponse().statusCode,
        });
      }));
  }
}
