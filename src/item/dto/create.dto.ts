import { IsString, IsDateString, IsBoolean, Length, IsNumber } from 'class-validator';
export class CreateDto {
  @Length(2, 30)
  @IsString()
  name: string;
  @IsString()
  description?: string;
  @IsDateString()
  toDoDate?: Date;
  @IsBoolean()
  ifDone?: Boolean;
  @IsNumber()
  endTime?: Number;
}