import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/settings.dto';

export interface SettingsResponse {
  siteName: string;
  tagline: string;
  hotline: string;
  email: string;
  emailHr?: string;
  address: string;
  officeBitexco?: string;
  heroImage: string;
  logoUrl?: string;
  zaloIconUrl?: string;
  partners: string[];
}

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapSettings(settings: {
    siteName: string;
    tagline: string;
    hotline: string;
    email: string;
    emailHr: string | null;
    address: string;
    officeBitexco: string | null;
    heroImage: string;
    logoUrl: string | null;
    zaloIconUrl: string | null;
    partners: string[];
  }): SettingsResponse {
    return {
      siteName: settings.siteName,
      tagline: settings.tagline,
      hotline: settings.hotline,
      email: settings.email,
      emailHr: settings.emailHr ?? undefined,
      address: settings.address,
      officeBitexco: settings.officeBitexco ?? undefined,
      heroImage: settings.heroImage,
      logoUrl: settings.logoUrl ?? undefined,
      zaloIconUrl: settings.zaloIconUrl ?? undefined,
      partners: settings.partners,
    };
  }

  async get(): Promise<SettingsResponse> {
    const settings = await this.prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });
    if (!settings) {
      throw new Error('Site settings not seeded');
    }
    return this.mapSettings(settings);
  }

  async update(dto: UpdateSettingsDto): Promise<SettingsResponse> {
    const settings = await this.prisma.siteSettings.update({
      where: { id: 'default' },
      data: dto,
    });
    return this.mapSettings(settings);
  }
}
