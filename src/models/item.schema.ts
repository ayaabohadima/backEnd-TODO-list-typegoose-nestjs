import { prop, Ref } from "@typegoose/typegoose";

export class Item {
  @prop({ required: true })
  name: string;
  @prop({ options: true })
  description?: string;
  @prop({ required: false })
  toDoDate: Date;
  @prop({ default: false })
  ifDone: boolean;
}