import { OmitType } from '@nestjs/swagger';
import { BookDto } from '../common/book.dto';

export class BookRequestDto extends OmitType(BookDto, ['bookId']) {}
