import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private mapUser(user: any) {
    const { passwordHash, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => this.mapUser(u));
  }

  async findById(id: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản nhân viên');
    return this.mapUser(user);
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email này đã được đăng ký sử dụng');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.adminUser.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        role: dto.role,
      },
    });
    return this.mapUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản nhân viên');

    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.adminUser.findUnique({
        where: { email: dto.email },
      });
      if (existing) throw new ConflictException('Email này đã được đăng ký sử dụng');
    }

    const data: any = {
      email: dto.email,
      name: dto.name,
      role: dto.role,
    };

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.adminUser.update({
      where: { id },
      data,
    });
    return this.mapUser(updated);
  }

  async remove(id: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy tài khoản nhân viên');

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await this.prisma.adminUser.count({
        where: { role: 'admin' },
      });
      if (adminCount <= 1) {
        throw new ConflictException('Không thể xóa tài khoản quản trị cuối cùng của hệ thống');
      }
    }

    await this.prisma.adminUser.delete({ where: { id } });
    return { success: true };
  }
}
