import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as Sentry from '@sentry/node';
import { join } from 'path';

import { ConfigService } from './config/config.service';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  Sentry.init({ dsn: config.get('SENTRY_DNS') });


  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.enableCors({ credentials: true });

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use((req, res, next) => {
    if (req.path === '/') {
      return res.redirect('/login');
    }
    next();
  });

  app.use((req, res, next) => {
    if (req.path === '/admin') {
      return res.redirect('/admin/upload');
    }
    next();
  });

  await app.listen(config.get('PORT'), () => {
    console.log(JSON.stringify(config.list()));
  });
}
bootstrap();
