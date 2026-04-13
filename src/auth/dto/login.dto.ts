import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from "class-validator";
import { Role } from "src/common/enums/roles.enum";

export class LoginDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'Email de connexion',
  })
  @IsEmail()
  email !: string;

  @ApiProperty({
    example: 'Azerty123!',
    description: 'Mot de passe',
    minLength: 6,
  })
  @IsNotEmpty()
  password !: string;

}