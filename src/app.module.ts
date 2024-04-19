import { Module } from '@nestjs/common';
import { BooksModule } from './modules/books/books.module';
import { ClientsModule } from './modules/clients/clients.module';
import { PersistenceModule } from './libs/persistence/persistence.module';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './libs/persistence/db-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig],
      isGlobal: true,
    }),
    PersistenceModule,
    BooksModule,
    ClientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
