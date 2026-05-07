import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CompleteOwnerProfileDto {
  @ApiProperty({ example: 'Leila Trabelsi' })
  @IsString()
  @IsNotEmpty()
  full_name!: string;

  @ApiProperty({ example: 'Passionnée par le développement durable et le tourisme éco-responsable.' })
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

  @ApiProperty({ example: 'AFRATIM Voyages' })
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiProperty({ example: 'Directrice' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ example: '+21612345678' })
  @IsOptional()
  @IsString()
  phone?: string;
}
