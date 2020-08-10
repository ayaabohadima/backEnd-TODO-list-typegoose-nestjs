import { IsOptional, Length, IsBoolean, IsNumber, IsString } from "class-validator";
export class UpdateDto {
  @IsOptional()
  @IsString()
  @Length(2, 20)
  name?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  toDoDate?: Date;
  @IsNumber()
  endTime?: Number;
  @IsOptional()
  @IsBoolean()
  ifDone?: boolean;
}
