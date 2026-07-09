import { Injectable, NotFoundException } from '@nestjs/common';
import { BannerPage, BannerStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { formatDate } from '../common/utils/slug.util';
import {
  BannerQueryDto,
  CreateBannerDto,
  UpdateBannerDto,
} from './dto/banner.dto';

export interface BannerResponse {
  id: string;
  title: string;
  image: string;
  link: string;
  page: BannerPage;
  status: BannerStatus;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  private mapBanner(banner: {
    id: string;
    title: string;
    image: string;
    link: string;
    page: BannerPage;
    status: BannerStatus;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
  }): BannerResponse {
    return {
      id: banner.id,
      title: banner.title,
      image: banner.image,
      link: banner.link,
      page: banner.page,
      status: banner.status,
      clicks: banner.clicks,
      createdAt: formatDate(banner.createdAt),
      updatedAt: formatDate(banner.updatedAt),
    };
  }

  async findAll(query: BannerQueryDto): Promise<BannerResponse[]> {
    const banners = await this.prisma.banner.findMany({
      where: {
        page: query.page,
        status: query.status,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return banners.map((b) => this.mapBanner(b));
  }

  async findById(id: string): Promise<BannerResponse> {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    return this.mapBanner(banner);
  }

  async create(dto: CreateBannerDto): Promise<BannerResponse> {
    const banner = await this.prisma.banner.create({ data: dto });
    return this.mapBanner(banner);
  }

  async update(id: string, dto: UpdateBannerDto): Promise<BannerResponse> {
    await this.findById(id);
    const banner = await this.prisma.banner.update({
      where: { id },
      data: dto,
    });
    return this.mapBanner(banner);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.banner.delete({ where: { id } });
  }

  async incrementClicks(id: string): Promise<BannerResponse> {
    const banner = await this.prisma.banner.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
    return this.mapBanner(banner);
  }
}
