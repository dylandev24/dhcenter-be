import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { TeamService } from './team.service';

@ApiTags('team')
@Controller('team-members')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Public()
  @Get()
  findAll() {
    return this.teamService.findAll();
  }
}
