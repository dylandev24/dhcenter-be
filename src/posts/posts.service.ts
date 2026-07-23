import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma, PostStatus, PostVisibility } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { formatDate, slugify } from '../common/utils/slug.util';
import { paginate, PaginatedResult } from '../common/dto/pagination.dto';
import { CreatePostDto, PostQueryDto, UpdatePostDto } from './dto/post.dto';

export interface PostResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  bannerImage?: string;
  bannerOverlay?: boolean;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  status: PostStatus;
  visibility: PostVisibility;
  featured: boolean;
  publishedAt: string;
  views: number;
  updatedAt: string;
  authorId?: string;
  author?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeFields = {
    category: true,
    author: {
      select: { id: true, name: true, email: true, role: true },
    },
  };

  private mapPost(post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    bannerImage: string | null;
    bannerOverlay: boolean;
    tags: string[];
    metaTitle: string | null;
    metaDescription: string | null;
    status: PostStatus;
    visibility: PostVisibility;
    featured: boolean;
    publishedAt: Date;
    views: number;
    updatedAt: Date;
    category: { name: string };
    authorId?: string | null;
    author?: { id: string; name: string; email: string; role: string } | null;
  }): PostResponse {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category.name,
      image: post.image,
      bannerImage: post.bannerImage ?? undefined,
      bannerOverlay: post.bannerOverlay,
      tags: post.tags,
      metaTitle: post.metaTitle ?? undefined,
      metaDescription: post.metaDescription ?? undefined,
      status: post.status,
      visibility: post.visibility,
      featured: post.featured,
      publishedAt: formatDate(post.publishedAt),
      views: post.views,
      updatedAt: formatDate(post.updatedAt),
      authorId: post.authorId ?? undefined,
      author: post.author
        ? {
            id: post.author.id,
            name: post.author.name,
            email: post.author.email,
            role: post.author.role,
          }
        : undefined,
    };
  }

  private async resolveCategory(categoryName: string) {
    const slug = slugify(categoryName);
    return this.prisma.category.upsert({
      where: { slug },
      update: { name: categoryName },
      create: { name: categoryName, slug },
    });
  }

  async findAll(query: PostQueryDto): Promise<PaginatedResult<PostResponse>> {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const where: Prisma.PostWhereInput = {};

    if (query.status) where.status = query.status;
    if (query.visibility) where.visibility = query.visibility;
    if (query.featured !== undefined) where.featured = query.featured;
    if (query.authorId) where.authorId = query.authorId;
    if (query.category) {
      where.category = {
        OR: [{ slug: query.category }, { name: query.category }],
      };
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { excerpt: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, posts] = await Promise.all([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        include: this.includeFields,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return paginate(
      posts.map((p) => this.mapPost(p)),
      total,
      page,
      pageSize,
    );
  }

  async findBySlug(slug: string): Promise<PostResponse> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: this.includeFields,
    });
    if (!post) throw new NotFoundException('Post not found');
    return this.mapPost(post);
  }

  async findById(id: string): Promise<PostResponse> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: this.includeFields,
    });
    if (!post) throw new NotFoundException('Post not found');
    return this.mapPost(post);
  }

  async create(dto: CreatePostDto, authorId?: string): Promise<PostResponse> {
    const slug = dto.slug?.trim() || slugify(dto.title);
    const existing = await this.prisma.post.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Slug already exists');

    const category = await this.resolveCategory(dto.category);
    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        image: dto.image,
        bannerImage: dto.bannerImage,
        bannerOverlay: dto.bannerOverlay ?? false,
        tags: dto.tags ?? [],
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        status: dto.status,
        visibility: dto.visibility,
        featured: dto.featured ?? false,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
        categoryId: category.id,
        authorId: authorId ?? null,
      },
      include: this.includeFields,
    });
    return this.mapPost(post);
  }

  async update(id: string, dto: UpdatePostDto, currentUser?: any): Promise<PostResponse> {
    const existing = await this.prisma.post.findUnique({
      where: { id },
      include: this.includeFields,
    });
    if (!existing) throw new NotFoundException('Post not found');

    if (currentUser && currentUser.role !== 'admin') {
      if (existing.authorId && existing.authorId !== currentUser.id) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết của người khác');
      }
    }

    if (dto.slug) {
      const conflict = await this.prisma.post.findFirst({
        where: { slug: dto.slug, NOT: { id } },
      });
      if (conflict) throw new ConflictException('Slug already exists');
    }

    let categoryId: string | undefined;
    if (dto.category) {
      const category = await this.resolveCategory(dto.category);
      categoryId = category.id;
    }

    const post = await this.prisma.post.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,
        image: dto.image,
        bannerImage: dto.bannerImage,
        bannerOverlay: dto.bannerOverlay,
        tags: dto.tags,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        status: dto.status,
        visibility: dto.visibility,
        featured: dto.featured,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        categoryId,
      },
      include: this.includeFields,
    });
    return this.mapPost(post);
  }

  async remove(id: string, currentUser?: any): Promise<void> {
    const existing = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Post not found');

    if (currentUser && currentUser.role !== 'admin') {
      if (existing.authorId && existing.authorId !== currentUser.id) {
        throw new ForbiddenException('Bạn không có quyền xóa bài viết của người khác');
      }
    }

    await this.prisma.post.delete({ where: { id } });
  }

  async incrementViews(id: string): Promise<PostResponse> {
    const post = await this.prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: this.includeFields,
    });
    return this.mapPost(post);
  }

  async incrementViewsBySlug(slug: string): Promise<PostResponse> {
    const existing = await this.prisma.post.findUnique({ where: { slug } });
    if (!existing) throw new NotFoundException('Post not found');
    return this.incrementViews(existing.id);
  }
}
