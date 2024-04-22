import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginatedBooksRequestDto {
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
