import { Body, Controller, Patch, Post, Req, Get} from "@nestjs/common";
import { EcoTravelerService } from "./eco-traveler.service";
import { CompleteProfileDto, UpdateGoalsDto, UpdateInterestsDto, UpdateMotivationsDto, UpdateTravelerTypesDto } from "./dto/eco-traveler.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "../common/enums/roles.enum";
@ApiTags('Eco-Traveler')
@ApiBearerAuth('bearer')
@Roles(Role.ECO_TRAVELER)
@Controller('eco-traveler')
export class EcoTravelerController {
  constructor(private readonly service: EcoTravelerService) {}
 
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.service.getProfile(req.user.sub);
  }
 
  @Post('profile')
  completeProfile(@Req() req: any, @Body() dto: CompleteProfileDto) {
    return this.service.completeProfile(req.user.sub, dto);
  }
 
  @Patch('traveler-types')
  updateTravelerTypes(@Req() req: any, @Body() dto: UpdateTravelerTypesDto) {
    return this.service.updateTravelerTypes(req.user.sub, dto);
  }
 
  @Patch('motivations')
  updateMotivations(@Req() req: any, @Body() dto: UpdateMotivationsDto) {
    return this.service.updateMotivations(req.user.sub, dto);
  }
 
  @Patch('interests')
  updateInterests(@Req() req: any, @Body() dto: UpdateInterestsDto) {
    return this.service.updateInterests(req.user.sub, dto);
  }
 
  @Patch('goals')
  updateGoals(@Req() req: any, @Body() dto: UpdateGoalsDto) {
    return this.service.updateGoals(req.user.sub, dto);
  }
 
  @Post('onboarded')
  markOnboarded(@Req() req: any) {
    return this.service.markOnboarded(req.user.sub);
  }
}