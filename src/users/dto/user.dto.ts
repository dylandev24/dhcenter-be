import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { AdminRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Tên phải từ 2 ký tự trở lên' })
  name: string;

  @IsEnum(AdminRole, { message: 'Vai trò không hợp lệ' })
  role: AdminRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự trở lên' })
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Tên phải từ 2 ký tự trở lên' })
  name?: string;

  @IsOptional()
  @IsEnum(AdminRole, { message: 'Vai trò không hợp lệ' })
  role?: AdminRole;
}
