import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PropertyCategory, PropertyStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate, PaginatedResult } from '../common/dto/pagination.dto';
import {
  fromPropertyCategoryApi,
  slugify,
  toPropertyCategoryApi,
} from '../common/utils/slug.util';
import {
  CreatePropertyDto,
  PropertyQueryDto,
  UpdatePropertyDto,
} from './dto/property.dto';

export interface PropertyResponse {
  id: string;
  slug: string;
  title: string;
  location: string;
  district?: string;
  ward?: string;
  streetAddress?: string;
  price: string;
  width?: string;
  length?: string;
  area?: string;
  image: string;
  images: string[];
  badge?: string;
  description?: string;
  category: string;
  status: PropertyStatus;
  views?: string;
  posted?: string;
}

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  private mapProperty(property: {
    id: string;
    slug: string;
    title: string;
    location: string;
    district: string | null;
    ward?: string | null;
    streetAddress?: string | null;
    price: string;
    width?: string | null;
    length?: string | null;
    area: string | null;
    image: string;
    images: string[];
    badge: string | null;
    description: string | null;
    category: PropertyCategory;
    status: PropertyStatus;
    views: string | null;
    posted: string | null;
  }): PropertyResponse {
    return {
      id: property.id,
      slug: property.slug,
      title: property.title,
      location: property.location,
      district: property.district ?? undefined,
      ward: property.ward ?? undefined,
      streetAddress: property.streetAddress ?? undefined,
      price: property.price,
      width: property.width ?? undefined,
      length: property.length ?? undefined,
      area: property.area ?? undefined,
      image: property.image,
      images: property.images,
      badge: property.badge ?? undefined,
      description: property.description ?? undefined,
      category: toPropertyCategoryApi(property.category),
      status: property.status,
      views: property.views ?? undefined,
      posted: property.posted ?? undefined,
    };
  }

  private parseCategory(
    category: PropertyCategory | string,
  ): PropertyCategory {
    if (
      Object.values(PropertyCategory).includes(category as PropertyCategory)
    ) {
      return category as PropertyCategory;
    }
    return fromPropertyCategoryApi(
      category as 'mat-bang' | 'nha-dat' | 'toa-nha' | 'van-phong',
    );
  }

  async findAll(
    query: PropertyQueryDto,
  ): Promise<PaginatedResult<PropertyResponse>> {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 12;
    const where: Prisma.PropertyWhereInput = {};

    if (query.category) where.category = this.parseCategory(query.category);
    if (query.status) where.status = query.status;
    if (query.district) {
      where.district = { contains: query.district, mode: 'insensitive' };
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.priceMin !== undefined || query.priceMax !== undefined) {
      where.AND = [
        ...(query.priceMin !== undefined
          ? [{ priceMin: { gte: query.priceMin } }]
          : []),
        ...(query.priceMax !== undefined
          ? [{ priceMax: { lte: query.priceMax } }]
          : []),
      ];
    }
    if (query.areaMin !== undefined) {
      where.areaMin = { gte: query.areaMin };
    }
    if (query.areaMax !== undefined) {
      where.areaMax = { lte: query.areaMax };
    }

    let orderBy: Prisma.PropertyOrderByWithRelationInput = {
      createdAt: 'desc',
    };
    if (query.sort === 'price_asc') orderBy = { priceMin: 'asc' };
    if (query.sort === 'price_desc') orderBy = { priceMin: 'desc' };

    const [total, properties] = await Promise.all([
      this.prisma.property.count({ where }),
      this.prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return paginate(
      properties.map((p) => this.mapProperty(p)),
      total,
      page,
      pageSize,
    );
  }

  async findBySlug(slug: string): Promise<PropertyResponse> {
    const property = await this.prisma.property.findUnique({ where: { slug } });
    if (!property) throw new NotFoundException('Property not found');
    return this.mapProperty(property);
  }

  async findById(id: string): Promise<PropertyResponse> {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    return this.mapProperty(property);
  }

  async create(dto: CreatePropertyDto): Promise<PropertyResponse> {
    const slug = dto.slug?.trim() || slugify(dto.title);
    const existing = await this.prisma.property.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Slug already exists');

    const property = await this.prisma.property.create({
      data: {
        title: dto.title,
        slug,
        location: dto.location,
        district: dto.district,
        ward: dto.ward,
        streetAddress: dto.streetAddress,
        price: dto.price,
        priceMin: dto.priceMin,
        priceMax: dto.priceMax,
        width: dto.width,
        length: dto.length,
        area: dto.area,
        areaMin: dto.areaMin,
        areaMax: dto.areaMax,
        image: dto.image,
        images: dto.images ?? [],
        badge: dto.badge,
        description: dto.description,
        category: this.parseCategory(dto.category),
        status: dto.status ?? PropertyStatus.active,
        views: dto.views,
        posted: dto.posted,
      },
    });
    return this.mapProperty(property);
  }

  async update(id: string, dto: UpdatePropertyDto): Promise<PropertyResponse> {
    await this.findById(id);

    if (dto.slug) {
      const conflict = await this.prisma.property.findFirst({
        where: { slug: dto.slug, NOT: { id } },
      });
      if (conflict) throw new ConflictException('Slug already exists');
    }

    const property = await this.prisma.property.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        location: dto.location,
        district: dto.district,
        ward: dto.ward,
        streetAddress: dto.streetAddress,
        price: dto.price,
        priceMin: dto.priceMin,
        priceMax: dto.priceMax,
        width: dto.width,
        length: dto.length,
        area: dto.area,
        areaMin: dto.areaMin,
        areaMax: dto.areaMax,
        image: dto.image,
        images: dto.images,
        badge: dto.badge,
        description: dto.description,
        category: dto.category ? this.parseCategory(dto.category) : undefined,
        status: dto.status,
        views: dto.views,
        posted: dto.posted,
      },
    });
    return this.mapProperty(property);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.property.delete({ where: { id } });
  }
}
