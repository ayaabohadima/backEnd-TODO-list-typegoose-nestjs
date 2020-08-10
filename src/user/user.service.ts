import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from "../models/user.schema";
import * as bcrypt from 'bcrypt';
import { UserRepository } from './userRepository.service';
import { InjectModel } from "nestjs-typegoose";
import { RegisterDto } from '../auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { ReturnModelType } from "@typegoose/typegoose";


@Injectable()
export class UserService extends UserRepository {
    constructor(
        @InjectModel(User) private readonly _userModel: ReturnModelType<typeof User>
    ) {
        super();
        this.userModel = _userModel;

    }
    async getUserByID(userID): Promise<User | null> {
        const user = await this.findOne({ _id: userID });
        if (!user)
            throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
        return user;
    }

    async getUserByEmail(email): Promise<User | null> {
        const user = await this.findOne({ email: email });
        if (!user)
            return null;
        return user;
    }

    async createUser(createUserDto: RegisterDto) {
        // await this.checkCeateUserData(createUserDto);
        if (await this.getUserByEmail(createUserDto.email))
            throw new HttpException('"email" should not have acount', HttpStatus.FORBIDDEN,);
        const salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(createUserDto.password, salt);
        createUserDto.password = hash;
        return await this.create(createUserDto);
    }

    async findByLogin(loginDto: LoginDto): Promise<any> {
        const user = await this.findOne({ email: loginDto.email });
        if (!user)
            throw new HttpException('not user by this email', HttpStatus.FORBIDDEN);
        if (await bcrypt.compare(loginDto.password, user.password)) return user;
        throw new HttpException('password is not correct', HttpStatus.FORBIDDEN);

    }

    async findAllUsers(): Promise<User[] | null> {
        return await this.findAll();
    }

    async addItemToUser(itemId, userID) {
        const user = await this.getUserByID(userID);
        let items = user.items;
        items.push(itemId);
        await this.update(userID, { items: items });
        return 1;
    }

    async checkUserHaveItem(userID, itemID): Promise<Boolean> {
        const user = await this.getUserByID(userID);
        for (let i = 0; i < user.items.length; i++)
            if (String(user.items[i]) == String(itemID))
                return true;
        return false;

    }

    async deleteItemFromUser(userID, itemID) {
        if (!await this.checkUserHaveItem(userID, itemID))
            throw new HttpException('you do not have this item', HttpStatus.FORBIDDEN);
        const user = await this.getUserByID(userID);
        for (let i = 0; i < user.items.length; i++)
            if (String(user.items[i]) == String(itemID)) {
                user.items.splice(i, 1);
                await this.update(userID, { items: user.items });
                return true;
            }
        throw new HttpException('can not delete', HttpStatus.FORBIDDEN);
    }

    async getUserItem(userID) {
        const user = await this.getUserByID(userID);
        return user.items;
    }

    async deleteUser(userID) {
        const user = await this.getUserByID(userID);
        if (!user)
            throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
        await this.delete(userID);
    }

}