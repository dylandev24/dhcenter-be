import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import {
  ContactFormDto,
  NewsletterFormDto,
  RecruitmentFormDto,
} from './dto/form.dto';
import { FormsService } from './forms.service';

@ApiTags('forms')
@Controller()
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Public()
  @Post('contact')
  contact(@Body() dto: ContactFormDto) {
    return this.formsService.submitContact(dto);
  }

  @Public()
  @Post('recruitment')
  recruitment(@Body() dto: RecruitmentFormDto) {
    return this.formsService.submitRecruitment(dto);
  }

  @Public()
  @Post('newsletter')
  newsletter(@Body() dto: NewsletterFormDto) {
    return this.formsService.subscribeNewsletter(dto);
  }
}
