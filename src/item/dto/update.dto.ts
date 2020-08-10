import { IsString, IsDateString, IsBoolean, Length, IsNumber } from 'class-validator';
export class UpdateDto {
  @IsString()
  @Length(4, 30)
  name?: string;
  @IsString()
  description?: string;
  @IsDateString()
  toDoDate?: Date;
  @IsNumber()
  endTime?: Number;
  @IsBoolean()
  ifDone?: boolean;
}