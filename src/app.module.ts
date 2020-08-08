
import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
//import { CatsModule } from "./cat.module.ts";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ItemService } from './item/item.service';

@Module({
  imports: [

    TypegooseModule.forRoot(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
    }),
    AuthModule,
    UserModule,
    // CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ItemService],

}) export class AppModule { }
