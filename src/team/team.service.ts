import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface TeamMemberResponse {
  id: string;
  name: string;
  role: string;
  image: string;
}

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TeamMemberResponse[]> {
    return this.prisma.teamMember.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, role: true, image: true },
    });
  }
}
