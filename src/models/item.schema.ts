import { prop } from "@typegoose/typegoose";
import { IsString, IsOptional, Length, IsNumber } from 'class-validator';

export class Item {
  @Length(2, 30)
  @IsString()
  @prop({ required: true })
  name: string;
  @IsOptional()
  @IsString()
  @prop({ options: true })
  @IsOptional()
  description?: string;
  @IsOptional()
  @prop({ options: true })
  toDoDate?: Date;
  @IsOptional()
  @prop({ options: true })
  @IsNumber()
  endTime?: Number;
  @prop({ default: false })
  ifDone?: Boolean;
}