import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { ProjectOwnerService } from './project-owner.service';
import { CompleteOwnerProfileDto } from './dto/project-owner.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@ApiTags('Project-Owner')
@ApiBearerAuth('bearer')
@Roles(Role.PROJECT)
@Controller('project-owner')
export class ProjectOwnerController {
  constructor(private readonly service: ProjectOwnerService) {}

  // ─── Profile ──────────────────────────────────────────────────────────────

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.service.getProfile(req.user.sub);
  }

  @Post('profile')
  completeProfile(@Req() req: any, @Body() dto: CompleteOwnerProfileDto) {
    return this.service.completeProfile(req.user.sub, dto);
  }

  @Post('onboarded')
  markOnboarded(@Req() req: any) {
    return this.service.markOnboarded(req.user.sub);
  }

  // ─── Projects ─────────────────────────────────────────────────────────────

  @Get('projects')
  getProjects(@Req() req: any) {
    return this.service.getProjects(req.user.sub);
  }

  @Post('projects')
  createProject(@Req() req: any, @Body() dto: CreateProjectDto) {
    return this.service.createProject(req.user.sub, dto);
  }

  @Patch('projects/:id')
  updateProject(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.updateProject(req.user.sub, id, dto);
  }

  @Delete('projects/:id')
  deleteProject(@Req() req: any, @Param('id') id: string) {
    return this.service.deleteProject(req.user.sub, id);
  }
}
