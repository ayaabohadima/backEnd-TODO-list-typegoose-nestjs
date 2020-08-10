import { prop, Ref } from '@typegoose/typegoose';
import { Item } from './item.schema';
import { IsString, IsEmail, Length } from 'class-validator';

export class User {
  @prop({ required: true })
  @Length(2, 20)
  @IsString()
  userName: string;
  @Length(4, 12)
  @IsString()
  @prop({ required: true })
  password: string;
  @IsString()
  @IsEmail()
  @prop({ required: true })
  email: string;
  @prop({ ref: Item })
  items?: [Ref<Item>];
}