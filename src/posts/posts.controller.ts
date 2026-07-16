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
import { Roles } from '../common/decorators/roles.decorator';
import { CreatePostDto, PostQueryDto, UpdatePostDto } from './dto/post.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  findAll(@Query() query: PostQueryDto) {
    return this.postsService.findAll(query);
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @ApiBearerAuth()
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Public()
  @Post('slug/:slug/view')
  incrementViewsBySlug(@Param('slug') slug: string) {
    return this.postsService.incrementViewsBySlug(slug);
  }

  @Public()
  @Post(':id/view')
  incrementViews(@Param('id') id: string) {
    return this.postsService.incrementViews(id);
  }
}
