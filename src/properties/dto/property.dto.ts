import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PropertyCategory, PropertyStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePropertyDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsString()
  price: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaMax?: number;

  @IsString()
  image: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  badge?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PropertyCategory)
  category: PropertyCategory;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @IsString()
  views?: string;

  @IsOptional()
  @IsString()
  posted?: string;
}

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaMax?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  badge?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PropertyCategory)
  category?: PropertyCategory;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @IsString()
  views?: string;

  @IsOptional()
  @IsString()
  posted?: string;
}

export class PropertyQueryDto {
  @IsOptional()
  @IsEnum(PropertyCategory)
  category?: PropertyCategory;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  areaMax?: number;

  @IsOptional()
  @IsString()
  sort?: 'newest' | 'price_asc' | 'price_desc';

  @IsOptional()
  page?: number;

  @IsOptional()
  pageSize?: number;
}
