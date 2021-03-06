import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from "../models/user.schema";
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user-repository.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { LoginDto } from '../auth/dto/login.dto';


@Injectable()
export class UserService {
    constructor(
        private readonly UserRepository: UserRepository
    ) {

    }
    async getUserByID(userID): Promise<User | null> {
        const user = await this.UserRepository.findByID(userID);
        if (!user)
            throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
        return user;
    }

    async createUser(createUserDto: RegisterDto) {
        if (await this.UserRepository.findByEmail(createUserDto.email))
            throw new HttpException('"email" should not have acount', HttpStatus.FORBIDDEN,);
        const salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(createUserDto.password, salt);
        createUserDto.password = hash;
        return await this.UserRepository.createUser(createUserDto);
    }

    async findByLogin(loginDto: LoginDto) {
        const user = await this.UserRepository.findByEmail(loginDto.email);
        if (!user)
            throw new HttpException('not user by this email', HttpStatus.FORBIDDEN);
        if (await bcrypt.compare(loginDto.password, user.password)) return user;
        throw new HttpException('password is not correct', HttpStatus.FORBIDDEN);

    }

    async findAllUsers(): Promise<User[] | null> {
        return await this.UserRepository.findAll();
    }

    async addItemToUser(itemID, userID) {
        const user = await this.getUserByID(userID);
        return await this.UserRepository.addItemToUser(userID, itemID);
    }

    async checkUserHaveItem(userID, itemID): Promise<Boolean> {
        const user = await this.getUserByID(userID);
        return await this.UserRepository.checkUserHaveItem(userID, itemID);

    }

    async deleteItemFromUser(userID, itemID) {
        if (!await this.checkUserHaveItem(userID, itemID))
            throw new HttpException('you do not have this item', HttpStatus.FORBIDDEN);
        if (await this.UserRepository.deleteUserItem(userID, itemID))
            return true;
        throw new HttpException('can not delete', HttpStatus.FORBIDDEN);
    }

    async getUserItem(userID) {
        return await this.UserRepository.getUserItems(userID);
    }

    async deleteUser(userID) {
        const user = await this.getUserByID(userID);
        if (!user)
            throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
        await this.UserRepository.delete(userID);
    }

}