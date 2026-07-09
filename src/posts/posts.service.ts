import {
  Injectable,
  NotFoundException,
  ConflictException,
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
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

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
        include: { category: true },
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
      include: { category: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return this.mapPost(post);
  }

  async findById(id: string): Promise<PostResponse> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return this.mapPost(post);
  }

  async create(dto: CreatePostDto): Promise<PostResponse> {
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
      },
      include: { category: true },
    });
    return this.mapPost(post);
  }

  async update(id: string, dto: UpdatePostDto): Promise<PostResponse> {
    await this.findById(id);

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
      include: { category: true },
    });
    return this.mapPost(post);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.post.delete({ where: { id } });
  }

  async incrementViews(id: string): Promise<PostResponse> {
    const post = await this.prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: { category: true },
    });
    return this.mapPost(post);
  }

  async incrementViewsBySlug(slug: string): Promise<PostResponse> {
    const existing = await this.prisma.post.findUnique({ where: { slug } });
    if (!existing) throw new NotFoundException('Post not found');
    return this.incrementViews(existing.id);
  }
}
