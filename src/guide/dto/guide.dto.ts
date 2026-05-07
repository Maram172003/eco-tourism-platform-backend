import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min, Max } from 'class-validator';

export class CompleteGuideProfileDto {
  @ApiProperty({ example: 'Ahmed Ben Ali' })
  @IsString()
  @IsNotEmpty()
  full_name!: string;

  @ApiProperty({ example: 'local', enum: ['local', 'professionnel'] })
  @IsOptional()
  @IsString()
  guide_type?: string;

  @ApiProperty({ example: 'Guide spécialisé en écotourisme dans le sud tunisien.' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'TN' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'fr' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ example: 'Sahara, Djerba' })
  @IsOptional()
  @IsString()
  zone?: string;
}

export class UpdateGuideSpecialtiesDto {
  @ApiProperty({ example: ['randonnée', 'ornithologie', 'photographie'] })
  @IsArray()
  @IsString({ each: true })
  specialties!: string[];

  @ApiProperty({ example: ['fr', 'en', 'ar'] })
  @IsArray()
  @IsString({ each: true })
  languages_spoken!: string[];
}

export class UpdateGuideExperienceDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  @Max(50)
  years_experience!: number;

  @ApiProperty({ example: ['montagne', 'désert', 'forêt'] })
  @IsArray()
  @IsString({ each: true })
  landscapes!: string[];

  @ApiProperty({ example: ['Guide certifié AFRATIM', 'Premiers secours'] })
  @IsArray()
  @IsString({ each: true })
  certifications!: string[];
}
