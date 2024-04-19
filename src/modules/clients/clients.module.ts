import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './entities/client.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
})
export class ClientsModule {}

/* 
MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),: This is where the module imports the MongooseModule for a specific feature. It's defining a feature module that includes the Client entity and the ClientSchema. This means that the Client entity will be associated with the ClientSchema in the MongoDB database. 
*/
