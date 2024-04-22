import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BookRequestDto } from './books-request.dto';

export class PaginatedBooksRequestDto extends BookRequestDto {
  @IsNumber()
  @IsOptional()
  docsPerPage?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  sortBy?: string;
}
