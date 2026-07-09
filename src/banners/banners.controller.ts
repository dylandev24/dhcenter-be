import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { BannersService } from './banners.service';
import {
  BannerQueryDto,
  CreateBannerDto,
  UpdateBannerDto,
} from './dto/banner.dto';

@ApiTags('banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Public()
  @Get()
  findAll(@Query() query: BannerQueryDto) {
    return this.bannersService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.bannersService.findById(id);
  }

  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateBannerDto) {
    return this.bannersService.create(dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.bannersService.update(id, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(id);
  }

  @Public()
  @Post(':id/click')
  incrementClicks(@Param('id') id: string) {
    return this.bannersService.incrementClicks(id);
  }
}
