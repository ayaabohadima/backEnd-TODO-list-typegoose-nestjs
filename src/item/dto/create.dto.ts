import { Length, IsBoolean, IsOptional, IsDate, IsNumber, IsString } from "class-validator";
export class CreateDto {

  @IsString()
  @Length(2, 20)
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  toDoDate?: Date;
  @IsOptional()
  @IsBoolean()
  ifDone?: Boolean;
  @IsNumber()
  @IsOptional()
  endTime?: Number;
}