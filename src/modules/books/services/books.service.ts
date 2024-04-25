import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { BookDto } from '../dtos/common/book.dto';
import { Book } from '../entities/book.entity';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) protected bookModel: Model<Book>) {}

  async create(createBookDto: BookDto): Promise<Book> {
    try {
      const createdBook = new this.bookModel(createBookDto);
      return await createdBook.save();
    } catch (error) {
      this.throwUnhandledError(error, 'create', error.message);
    }
  }

  async findAll(): Promise<Book[]> {
    try {
      return await this.bookModel.find().exec();
    } catch (error) {
      this.throwUnhandledError(error, 'findAll', error.message);
    }
  }

  async findOne(id: string): Promise<Book> {
    try {
      return await this.bookModel.findOne({ bookId: id }).exec();
    } catch (error) {
      this.throwUnhandledError(
        error,
        'findOne',
        `Failed to fetch book with id ${id} error: ${error.message}`,
      );
    }
  }

  async findPaginated(
    filter: FilterQuery<Book>,
    sort?: Record<string, SortOrder>,
    limit = 400,
    skip = 0,
  ): Promise<any[]> {
    try {
      const records = await this.bookModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec();

      if (!records) {
        return null;
      }

      return records.map((record) => this.mapEntityToDto(record));
    } catch (error) {
      this.throwUnhandledError(
        error,
        'findPaginated',
        'Failed to fetch paginated books',
      );
    }
  }

  throwUnhandledError(error: any, context: string, message: string): never {
    console.error(`Unhandled Error in ${context}:`, error);
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  mapEntityToDto(book: Book): BookDto {
    const { bookId, title, author, pages, description } = book;
    return { bookId, title, author, pages, description };
  }

  async update(id: string, updateBookDto: BookDto): Promise<Book> {
    try {
      return await this.bookModel
        .findOneAndUpdate({ bookId: id }, updateBookDto, { new: true })
        .exec();
    } catch (error) {
      this.throwUnhandledError(
        error,
        'update',
        `Failed to update book with id ${id}`,
      );
    }
  }

  async remove(id: string): Promise<Book> {
    try {
      return await this.bookModel.findOneAndDelete({ bookId: id }).exec();
    } catch (error) {
      this.throwUnhandledError(
        error,
        'remove',
        `Failed to remove book with id ${id}`,
      );
    }
  }
}
