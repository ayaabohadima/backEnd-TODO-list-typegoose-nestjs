import { prop } from "@typegoose/typegoose";
import { IsString, IsDate, Length, IsNumber } from 'class-validator';

export class Item {
  @Length(2, 30)
  @IsString()
  @prop({ required: true })
  name: string;
  @IsString()
  @prop({ options: true })
  description?: string;
  @IsDate()
  @prop({ options: true })
  toDoDate?: Date;
  @prop({ options: true })
  @IsNumber()
  endTime?: Number;
  @prop({ default: false })
  ifDone?: Boolean;
}