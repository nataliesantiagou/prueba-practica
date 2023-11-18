import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards} from '@nestjs/common';
import {StoreDto} from "../store/store.dto";
import {StoreEntity} from "../store/store.entity";
import {StoreService} from "./store.service";
import {plainToInstance} from "class-transformer";

@Controller('stores')
export class StoreController {

    constructor(private readonly storeService: StoreService) {

    }

    @Get()
    async findAll() {
        return await this.storeService.findAll();
    }

    @Get(':storeId')
    async findOne(@Param('storeId') id: number) {
        return await this.storeService.findOne(id);
    }

    @Post()
    async create(@Body() storeDto: StoreDto) {
        const store: StoreEntity = plainToInstance(StoreEntity, storeDto);
        return await this.storeService.create(store);
    }

    @Put(':storeId')
    async update(@Param('storeId') id: number, @Body() storeDto: StoreDto) {
        const store: StoreEntity = plainToInstance(StoreEntity, storeDto);
        return await this.storeService.update(id, store);
    }

    @Delete(':storeId')
    @HttpCode(204)
    async delete(@Param('storeId') id: number) {
        return await this.storeService.delete(id);
    }
}