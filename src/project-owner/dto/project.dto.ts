import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Éco-Lodge Sahara' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'hebergement', enum: ['hebergement', 'restauration', 'artisanat', 'agence', 'centre_loisir'] })
  @IsOptional()
  @IsString()
  project_type?: string;

  @ApiProperty({ example: 'Un lodge éco-responsable au cœur du désert tunisien.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Tataouine' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ example: '12 route des dunes, Ksar Ghilane' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ example: ['hébergement', 'excursions', 'restauration'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiProperty({ example: ['panneaux solaires', 'eau recyclée', 'zéro plastique'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eco_labels?: string[];

  @ApiProperty({ example: 'https://ecolodge-sahara.tn' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ example: '+21698765432' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateProjectDto {
  @ApiProperty({ example: 'Éco-Lodge Sahara' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'hebergement' })
  @IsOptional()
  @IsString()
  project_type?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eco_labels?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;
}
