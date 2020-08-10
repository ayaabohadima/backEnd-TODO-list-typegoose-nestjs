import { Length, IsBoolean, IsDateString, IsDate, IsNumber, IsString } from "class-validator";
export class CreateDto {
  @IsString()
  @Length(2, 20)
  name: string;
  @IsString()
  description?: string;
  @IsDate()
  toDoDate?: Date;
  @IsBoolean()
  ifDone?: Boolean;
  @IsNumber()
  endTime?: Number;
}