import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { BookDto } from '../common/book.dto';

export class BookResponseDto extends BookDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  updatedAt: Date;
}
