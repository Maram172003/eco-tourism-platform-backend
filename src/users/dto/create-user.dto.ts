import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../../common/enums/roles.enum';



export class CreateUserDto {

  @IsNotEmpty()
  full_name !: string;
  @IsEmail()
  email !: string;

  @IsNotEmpty()
  @MinLength(6)
  password !: string;

  @IsEnum(Role)
  role !: Role;
}