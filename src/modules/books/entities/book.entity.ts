import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Book extends Document {
  @Prop({ required: true })
  bookId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true, min: 1, max: 2022 })
  pages: number;

  @Prop({ required: true })
  description: string;

  createdAt?: Date;

  updatedAt?: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.index(
  { bookId: 1 },
  {
    name: 'index to improve bookId search query',
  },
);
