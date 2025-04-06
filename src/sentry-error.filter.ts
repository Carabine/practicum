import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();

    Sentry.captureException(exception);

    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });

    throw exception;
  }
}