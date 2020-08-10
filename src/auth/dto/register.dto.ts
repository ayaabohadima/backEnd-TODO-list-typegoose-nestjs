import { IsString, IsEmail, Length } from 'class-validator';
export class RegisterDto {
  @Length(2, 20)
  @IsString()
  userName: string;
  @Length(4, 12)
  @IsString()
  password: string;
  @IsString()
  @IsEmail()
  email: string;
}
