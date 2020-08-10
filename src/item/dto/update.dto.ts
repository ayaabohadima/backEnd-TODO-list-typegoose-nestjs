import { Length, IsBoolean, IsDateString, IsDate, IsNumber, IsString } from "class-validator";
export class UpdateDto {
  @IsString()
  @Length(2, 20)
  name?: string;
  @IsString()
  description?: string;
  @IsDate()
  toDoDate?: Date;
  @IsNumber()
  endTime?: Number;
  @IsBoolean()
  ifDone?: boolean;
}
