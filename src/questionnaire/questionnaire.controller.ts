import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuestionnaireService } from './questionnaire.service';
import { SubmitQuestionnaireDto } from './dto/submit-questionnaire.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Questionnaire')
@ApiBearerAuth('bearer')
@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly service: QuestionnaireService) {}

  /** Get the active questionnaire for eco_travelers (public for preview) */
  @Public()
  @Get('active')
  getActive(@Query('type') type?: string) {
    return this.service.getActiveQuestionnaire(type ?? 'eco_traveler');
  }

  /** Get latest attempt for authenticated user */
  @Get('my-attempt')
  getMyAttempt(@Req() req: any) {
    return this.service.getMyLatestAttempt(req.user.sub);
  }

  /** Submit questionnaire answers */
  @Post('submit')
  submit(@Req() req: any, @Body() dto: SubmitQuestionnaireDto) {
    return this.service.submit(req.user.sub, dto);
  }
}