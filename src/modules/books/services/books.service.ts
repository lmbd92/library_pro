import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { BookDto } from '../dtos/common/book.dto';
import { Book } from '../entities/book.entity';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) protected bookModel: Model<Book>) {}

  async create(createBookDto: BookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<Book> {
    return this.bookModel.findOne({ bookId: id }).exec();
  }

  findPaginated(
    filter: FilterQuery<Book>,
    sort?: Record<string, SortOrder>,
    limit = 400,
    skip = 0,
  ): Promise<any[]> {
    return this.bookModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .catch((error) =>
        this.throwUnhandledError(
          error,
          'findSortedPaginated',
          `Book couldn't be returned`,
        ),
      )
      .then((records) => {
        if (!records) {
          return null;
        }

        return records.map((record) => this.mapEntityToDto(record));
      });
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
    return this.bookModel
      .findOneAndUpdate({ bookId: id }, updateBookDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Book> {
    return this.bookModel.findOneAndDelete({ bookId: id }).exec();
  }
}
