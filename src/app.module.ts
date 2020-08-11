import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { SharedModule } from './shared/shared.module';


@Module({
  imports: [
    TypegooseModule.forRoot(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
    }),
    AuthModule,
    UserModule,
    ItemModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],

}) export class AppModule { }
