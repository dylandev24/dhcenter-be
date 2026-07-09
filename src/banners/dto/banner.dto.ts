import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { BannerPage, BannerStatus } from '@prisma/client';

export class CreateBannerDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  image: string;

  @IsString()
  @MinLength(1)
  link: string;

  @IsEnum(BannerPage)
  page: BannerPage;

  @IsEnum(BannerStatus)
  status: BannerStatus;
}

export class UpdateBannerDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsEnum(BannerPage)
  page?: BannerPage;

  @IsOptional()
  @IsEnum(BannerStatus)
  status?: BannerStatus;
}

export class BannerQueryDto {
  @IsOptional()
  @IsEnum(BannerPage)
  page?: BannerPage;

  @IsOptional()
  @IsEnum(BannerStatus)
  status?: BannerStatus;
}
