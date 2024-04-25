import { Module } from '@nestjs/common';
import { BooksModule } from './modules/books/books.module';
import { ClientsModule } from './modules/clients/clients.module';
import { PersistenceModule } from './libs/persistence/persistence.module';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './libs/persistence/db-config';
import { AuthModule } from './libs/auth/auth.module';
import { SharedModule } from './libs/shared/shared.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './libs/auth/guards/at.guard';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig],
      isGlobal: true,
    }),
    PersistenceModule,
    AuthModule,
    SharedModule,
    BooksModule,
    ClientsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
