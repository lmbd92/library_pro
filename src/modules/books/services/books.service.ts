import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { BookDto } from '../dtos/common/book.dto';
import { Book } from '../entities/book.entity';
import { BookResponseDto } from '../dtos/responses/books-response.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) protected bookModel: Model<Book>) {}

  async create(createBookDto: BookDto): Promise<Book> {
    const existingBook = await this.bookModel
      .findOne({ bookId: createBookDto.bookId })
      .exec();
    if (existingBook) {
      throw new HttpException(
        `Book with id ${createBookDto.bookId} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdBook = new this.bookModel(createBookDto);
    return await createdBook.save();
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findOne({ bookId: id }).exec();
    if (!book) {
      throw new HttpException(
        `Book with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return book;
  }

  async findPaginated(
    filter: FilterQuery<Book>,
    sort?: Record<string, SortOrder>,
    docsPerPage?: number,
    offset?: number,
  ): Promise<BookResponseDto[]> {
    const records = await this.bookModel
      .find(filter)
      .sort(sort)
      .skip(offset)
      .limit(docsPerPage)
      .exec();

    if (!records) {
      throw new HttpException(
        'No books found with the provided criteria',
        HttpStatus.NOT_FOUND,
      );
    }

    return records.map((record) => this.mapEntityToDto(record));
  }

  mapEntityToDto(book: Book): BookResponseDto {
    const { bookId, title, author, pages, description, createdAt, updatedAt } =
      book;
    return { bookId, title, author, pages, description, createdAt, updatedAt };
  }

  async update(id: string, updateBookDto: BookDto): Promise<Book> {
    const updatedBook = await this.bookModel
      .findOneAndUpdate({ bookId: id }, updateBookDto, { new: true })
      .exec();
    if (!updatedBook) {
      throw new HttpException(
        `Book with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedBook;
  }

  async remove(id: string): Promise<void> {
    const deletedBook = await this.bookModel
      .findOneAndDelete({ bookId: id })
      .exec();
    if (!deletedBook) {
      throw new HttpException(
        `Book with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
