import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UserAnswerInputDto {
  @ApiProperty({ description: 'Question UUID' })
  @IsString()
  @IsNotEmpty()
  question_id!: string;

  @ApiProperty({ description: 'Chosen answer UUID' })
  @IsString()
  @IsNotEmpty()
  answer_id!: string;
}

export class SubmitQuestionnaireDto {
  @ApiProperty({ description: 'Questionnaire UUID' })
  @IsString()
  @IsNotEmpty()
  questionnaire_id!: string;

  @ApiProperty({ type: [UserAnswerInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAnswerInputDto)
  answers!: UserAnswerInputDto[];
}