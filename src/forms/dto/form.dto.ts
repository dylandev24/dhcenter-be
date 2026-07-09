import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ContactFormDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(9)
  phone: string;

  @IsString()
  @MinLength(2)
  subject: string;

  @IsString()
  @MinLength(10)
  message: string;
}

export class RecruitmentFormDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(9)
  phone: string;

  @IsString()
  @MinLength(1)
  position: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;

  @IsString()
  @MinLength(10)
  message: string;
}

export class NewsletterFormDto {
  @IsEmail()
  email: string;
}
