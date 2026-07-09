import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slug.util';
import { CreateCategoryDto } from './dto/category.dto';

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryResponse[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      postCount: c._count.posts,
    }));
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponse> {
    const slug = slugify(dto.name);
    const existing = await this.prisma.category.findFirst({
      where: { OR: [{ slug }, { name: dto.name }] },
    });
    if (existing) throw new ConflictException('Category already exists');

    const category = await this.prisma.category.create({
      data: { name: dto.name, slug },
      include: { _count: { select: { posts: true } } },
    });

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      postCount: category._count.posts,
    };
  }

  async remove(id: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { posts: true } } },
    });
    if (!category) throw new NotFoundException('Category not found');
    if (category._count.posts > 0) {
      throw new ConflictException('Cannot delete category with posts');
    }
    await this.prisma.category.delete({ where: { id } });
  }
}
