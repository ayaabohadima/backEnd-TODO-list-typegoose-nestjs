import { Length, IsBoolean, IsDate, IsOptional, IsNumber, IsString } from "class-validator";
import { Type } from 'class-transformer';
export class CreateDto {

  @IsString()
  @Length(2, 20)
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toDoDate?: Date;
  @IsOptional()
  @IsBoolean()
  ifDone?: Boolean;
  @IsNumber()
  @IsOptional()
  endTime?: Number;
}