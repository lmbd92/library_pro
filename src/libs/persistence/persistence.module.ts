/* 
  1. The PersistenceModule is responsible for configuring the connection to the database. 
  2. The MongooseModule.forRootAsync method is used to configure the connection to the database. 
  3. The useFactory function is responsible for returning the connection configuration object. 
  4. The inject property is used to inject the configuration object into the useFactory function.
 */

import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import dbConfig from './db-config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof dbConfig>) => {
        const { db, env } = configService;
        const uriDb =
          env === 'local'
            ? `${db.connection}${db.host}/${db.name}`
            : `mongodb+srv://${db.user}:${db.password}@cluster0.mongodb.net/${db.name}?retryWrites=true&w=majority`;
        return {
          uri: uriDb,
        };
      },
      inject: [dbConfig.KEY],
    }),
  ],
})
export class PersistenceModule {}

/* 
It defines a PersistenceModule with a single import: MongooseModule.forRootAsync(). This function configures the Mongoose module with a connection to a MongoDB database.

Inside forRootAsync(), it defines a factory function that returns the configuration for the Mongoose module. This function takes a configService parameter, which is an instance of ConfigType<typeof dbConfig>. This means it's an object that has the same shape as the default export of ./db-config.

The factory function destructures db and env from configService. These are presumably configuration values for the database and the environment.

It defines a uriDb variable that holds the MongoDB connection string. If env is 'local', it constructs a connection string for a local MongoDB database. If env is not 'local', it constructs a connection string for a MongoDB Atlas database.

It returns an object with a single property uri, which is the MongoDB connection string. This object is the configuration for the Mongoose module.


 */
