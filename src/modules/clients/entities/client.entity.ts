import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Client extends Document {
  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  gender: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  address: string;

  createdAt?: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
