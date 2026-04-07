import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from "class-validator";
import { Role } from "src/common/enums/roles.enum";


export class RegisterDto {
  @ApiProperty({
    example: 'Maram mrjti',
    description: 'nom et prénom',
    minLength: 5,
  })
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    example: 'test@example.com',
    description: 'Email de l’utilisateur',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Azerty123!',
    description: 'Mot de passe',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'eco_traveler',
    enum: Role,
    description: 'Rôle de l’utilisateur',
  })
  @IsEnum(Role)
  role: Role;
}