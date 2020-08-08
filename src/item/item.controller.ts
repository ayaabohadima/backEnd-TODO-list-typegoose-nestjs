import { Controller, Post, Get, Body, Put, Request } from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from '../models/item.schema'

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }

    @Post('/create')
    async create(@Body() item: Item, @Request() req) {
        const createdUser = await this.itemService.create(item, req.user._id);
        if (createdUser) return createdUser;
    }



}
