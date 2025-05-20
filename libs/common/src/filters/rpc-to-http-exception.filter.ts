import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcToHttpExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    // 에러 객체 분석하여 적절한 HTTP 상태 코드 추출
    if (typeof error === 'object') {
      if ('error' in error && typeof error.error === 'object') {
        // error.error 구조 (예: { response: { statusCode: 403, ... }, status: 403, ... })
        const innerError = error.error as any;
        status =
          innerError.status ||
          (innerError.response && innerError.response.statusCode) ||
          HttpStatus.INTERNAL_SERVER_ERROR;
        message =
          innerError.message ||
          (innerError.response && innerError.response.message) ||
          'Internal Server Error';
      } else if ('response' in error && typeof error.response === 'object') {
        // error 구조 (예: { response: { statusCode: 403, ... }, ... })
        const errorObj = error as any;
        status =
          errorObj.status ||
          (errorObj.response && errorObj.response.statusCode) ||
          HttpStatus.INTERNAL_SERVER_ERROR;
        message =
          errorObj.message ||
          (errorObj.response && errorObj.response.message) ||
          'Internal Server Error';
      } else if ('statusCode' in error) {
        // 단순 구조 (예: { statusCode: 403, message: '...' })
        const errorObj = error as any;
        status = errorObj.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        message = errorObj.message || 'Internal Server Error';
      }
    } else if (typeof error === 'string') {
      message = error;
    }

    // 요청 컨텍스트를 HTTP 컨텍스트로 전환
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();

      // HTTP 응답 직접 처리
      response.status(status).json({
        statusCode: status,
        message: message,
        error: HttpStatus[status],
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      });

      // 응답을 직접 처리했으므로 빈 Observable 반환
      return new Observable();
    }

    // 다른 컨텍스트에서는 기존 방식 유지
    return throwError(() => new HttpException(message, status));
  }
}
