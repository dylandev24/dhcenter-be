import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PropertyCategory, PropertyStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  PROPERTY_CATEGORY_REVERSE,
  type PropertyCategoryApi,
} from '../../common/utils/slug.util';

/** Accept both `mat_bang` and `mat-bang` from clients */
function toPropertyCategoryEnum({ value }: { value?: string }) {
  if (!value) return value;
  if (Object.values(PropertyCategory).includes(value as PropertyCategory)) {
    return value;
  }
  if (value in PROPERTY_CATEGORY_REVERSE) {
    return PROPERTY_CATEGORY_REVERSE[value as PropertyCategoryApi];
  }
  return value;
}

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

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
  streetAddress?: string;

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
  width?: string;

  @IsOptional()
  @IsString()
  length?: string;

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

  @Transform(toPropertyCategoryEnum)
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
  ward?: string;

  @IsOptional()
  @IsString()
  streetAddress?: string;

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
  width?: string;

  @IsOptional()
  @IsString()
  length?: string;

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
  @Transform(toPropertyCategoryEnum)
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
  @Transform(toPropertyCategoryEnum)
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
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;
}
