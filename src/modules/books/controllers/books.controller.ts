import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { BookDto } from '../dtos/common/book.dto';
import { PaginatedBooksRequestDto } from '../dtos/requests/paginated-books-request.dto';
import { BookResponseDto } from '../dtos/responses/books-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from '../entities/book.entity';
import { Model } from 'mongoose';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  @Post()
  async create(@Body() createBookDto: BookDto): Promise<Book> {
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

  @Get()
  async findAll() {
    return await this.booksService.findAll();
  }

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  async findPaginated(
    @Query() query: PaginatedBooksRequestDto,
  ): Promise<BookResponseDto[]> {
    const bookList = await this.booksService.findPaginated(
      query,
      { createdAt: -1 },
      query.docsPerPage,
      query.offset,
    );
    return bookList;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new HttpException(
        `Book with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return book;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() bookDto: BookDto) {
    const book = await this.booksService.update(id, bookDto);
    if (!book) {
      throw new HttpException(
        `Book with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return book;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const book = await this.booksService.remove(id);
    if (!book) {
      throw new HttpException(
        `Book with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return book;
  }
}
