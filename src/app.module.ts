import { Logger, Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { UtilsModule } from './utils/utils.module';
import { AdminModule } from './api/admin/admin.module';
import { DocumentModule } from './document/document.module';
import { PdfModule } from './pdf/pdf.module';
import { LoginModule } from './api/login/login.module';
import { ProfileModule } from './api/profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { MailerModule } from './mailer/mailer.module';
import { WinstonLoggerService } from './logger/winston-logger.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'test-results-nestjs',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    ConfigModule,
    UtilsModule,
    AdminModule,
    DocumentModule,
    PdfModule,
    LoginModule,
    ProfileModule,
    MailerModule,
    LoggerModule
  ],
  controllers: [],
  providers: [WinstonLoggerService],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor(private readonly winstonLogger: WinstonLoggerService) {}

  onModuleInit() {
    this.logger.log('Модуль ініціалізовано');
    this.winstonLogger.log('Модуль ініціалізовано та записано в файл');
  }
}