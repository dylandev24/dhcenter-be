import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ContactFormDto,
  NewsletterFormDto,
  RecruitmentFormDto,
} from './dto/form.dto';

@Injectable()
export class FormsService {
  constructor(private readonly prisma: PrismaService) {}

  async submitContact(dto: ContactFormDto) {
    await this.prisma.contactSubmission.create({ data: dto });
    return {
      success: true,
      message: 'Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất.',
    };
  }

  async submitRecruitment(dto: RecruitmentFormDto) {
    await this.prisma.recruitmentApplication.create({
      data: {
        ...dto,
        cvUrl: dto.cvUrl || null,
      },
    });
    return {
      success: true,
      message: 'Đơn ứng tuyển đã được gửi thành công.',
    };
  }

  async subscribeNewsletter(dto: NewsletterFormDto) {
    const existing = await this.prisma.newsletterSubscription.findUnique({
      where: { email: dto.email },
    });
    if (existing?.active) {
      throw new ConflictException('Email đã được đăng ký');
    }

    if (existing) {
      await this.prisma.newsletterSubscription.update({
        where: { email: dto.email },
        data: { active: true },
      });
    } else {
      await this.prisma.newsletterSubscription.create({
        data: { email: dto.email },
      });
    }

    return {
      success: true,
      message: 'Đăng ký nhận tin thành công.',
    };
  }
}
