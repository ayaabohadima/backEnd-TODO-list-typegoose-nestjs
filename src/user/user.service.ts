import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from "../models/user.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import * as Joi from '@hapi/joi';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
    ) { }
    async getUserByID(userID): Promise<User | null> {
        const user = await this.userModel.findOne({ _id: userID });
        if (!user)
            new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
        return user;
    }
    async getUserByEmail(email): Promise<User | null> {
        const user = await this.userModel.findOne({ email: email });
        if (!user)
            return null;
        return user;
    }
    async checkCeateUserData(createUserDto: {
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


    async findByLogin(loginDto: { email, password }): Promise<any> {
        const user = await this.userModel
            .findOne({ email: loginDto.email })
            .exec()
            .then(async user => {
                return user ? user : 0;
            });
        if (!user)
            throw new HttpException('not user by this email', HttpStatus.FORBIDDEN);
        if (await bcrypt.compare(loginDto.password, user.password)) return user;
        throw new HttpException('password is not correct', HttpStatus.FORBIDDEN);

    }
    async findAll(): Promise<User[] | null> {
        return await this.userModel.find().exec();
    }
    async addItemToUser(itemId, userID) {
        const user = await this.getUserByID(userID);
        let items = user.items;
        items.push(itemId);
        await this.userModel.updateOne({ _id: userID }, { items: items });
        return 1;
    }
    // and need handle if no user 
    // delete all user items
    async deleteUser(userID) {
        await this.userModel.findOneAndDelete({ _id: userID });
    }

}