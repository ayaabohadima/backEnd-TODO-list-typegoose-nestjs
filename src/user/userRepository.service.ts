import { User } from "../models/user.schema";
import { ReturnModelType } from "@typegoose/typegoose";
import { RegisterDto } from '../auth/dto/register.dto';
import { IRead } from '../shared/repository-interfaces/IRead'
import { IWrite } from '../shared/repository-interfaces/IWrite'

export abstract class UserRepository implements IWrite<User>, IRead<User>  {
    userModel: ReturnModelType<typeof User>;
    async findOne(files: {}) {
        return await this.userModel.findOne(files);
    }
    async findAll() {
        return await this.userModel.find().exec();
    }

    async find(files: {}) {
        return await this.userModel.find(files).exec();
    }

    async create(createUserDto: RegisterDto) {
        const createdUser = new this.userModel(createUserDto);
        await createdUser.save();
        return createdUser;
    }

    async update(id, updateInfo: {}) {
        if (await this.userModel.updateOne({ _id: id }, updateInfo))
            return true;
        return false;
    }

    async delete(id) {
        if (await this.userModel.findOneAndDelete({ _id: id }))
            return true;
        return false;
    }

}