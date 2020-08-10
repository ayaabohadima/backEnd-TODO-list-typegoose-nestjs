import { IsString, IsEmail, Length } from 'class-validator';
export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;
  @Length(4, 12)
  @IsString()
  password: string;
}
