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
} from '@nestjs/common';
import { BooksService } from '../services/books.service';
import { BookDto } from '../dtos/common/book.dto';
import { PaginatedBooksRequestDto } from '../dtos/requests/paginated-books-request.dto';
import { BookResponseDto } from '../dtos/responses/books-response.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() bookDto: BookDto) {
    return await this.booksService.create(bookDto);
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
    return await this.booksService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() bookDto: BookDto) {
    return await this.booksService.update(id, bookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.booksService.remove(id);
  }
}
