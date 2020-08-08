import { Controller, Post, Get, Body, Put, Request, Param, Query, Delete } from '@nestjs/common';
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
    @Put('/item/:item_id/toggle-done')
    async toggleDone(@Request() req, @Param() params) {
        // check user has this item 
        // toggle item doneFlage

    }

    @Put('/item/:item_id/update-name')
    async updateName(@Request() req, @Param() params, @Body() item: Item) {
        // check user has this item 
        // update all information unless ifDone

    }

    @Delete('/item/:item_id/update-name')
    async delete(@Request() req, @Param() params) {
        // check user has this item 
        // delete item 

    }
    @Get('/item/:item_id')
    async getItem(@Request() req, @Param() params) {
        // check user has this item 
        // get item  

    }

    @Get('/items')
    async getItems(@Request() req) {
        // check user has this item 
        // get all user items 

    }

    @Get('/undo-items')
    async getItemsUndo(@Request() req) {
        // check user has this item 
        // get all user  undo items 

    }

    // get item should done in this day
    // get item should done in this month
    // get item should done in this weak 



}
