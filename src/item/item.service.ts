import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Item } from "../models/item.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import * as Joi from '@hapi/joi';
@Injectable()
export class ItemService {
    constructor(
        @InjectModel(Item) private readonly itemModel: ReturnModelType<typeof Item>
    ) { }
    async getItemByID(id): Promise<Item | null> {
        const item = await this.itemModel.findOne({ _id: id });
        if (!item)
            new HttpException('not item', HttpStatus.BAD_REQUEST);
        return item;
    }

    async checkCeateUserData(createItemDto: {
        userName: string;
        password: string;
        email: string;
    }): Promise<Boolean> {
        const shcema = Joi.object({
            email: Joi.string().trim().email().required(),
            password: Joi.string().required(),
            userName: Joi.string().required()
        });
        const validate = shcema.validate(createUserDto);
        if (validate.error)
            throw new HttpException(validate.error, HttpStatus.FORBIDDEN);
        if (await this.getUserByEmail(createUserDto.email))
            throw new HttpException('"email" should not have acount', HttpStatus.FORBIDDEN,);
        return true;
    }
    async create(createUserDto: {
        userName: string;
        password: string;
        email: string;
    }): Promise<User> {
        await this.checkCeateUserData(createUserDto);
        const salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(createUserDto.password, salt);
        createUserDto.password = hash;
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }


}
