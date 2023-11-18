import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ProductStoreService} from "./product-store.service";
import {StoreDto} from "../store/store.dto";
import {ProductEntity} from "../product/product.entity";
import {ProductDto} from "../product/product.dto";
import {StoreEntity} from "../store/store.entity";
import {plainToInstance} from "class-transformer";

@Controller('products')
export class ProductStoreController {

    constructor(private readonly productStoreService: ProductStoreService) {
    }

    @Post(':productId/stores/:storeId')
    async addStore(@Param('productId') productId: number, @Param('storeId') storeId: number) {
        return await this.productStoreService.addStoreToProduct(productId, storeId);
    }

    @Get(':productId/stores')
    async getStores(@Param('productId') id: number) {
        return await this.productStoreService.findStoresFromProduct(id);
    }

    @Get(':productId/stores/:storeId')
    async getStore(@Param('productId') productId: number, @Param('storeId') storeId: number) {
        return await this.productStoreService.findStoreFromProduct(productId, storeId);
    }

    @Put(':productId/stores')
    async associateStores(@Param('productId') productId: number, @Body() storesDto: StoreDto[]) {
        const store: StoreEntity[] = plainToInstance(StoreEntity, storesDto);
        return await this.productStoreService.updateStoresFromProduct(productId, store);
    }

    @Delete(':productId/stores/:storeId')
    @HttpCode(204)
    async deleteStore(@Param('productId') productId: number, @Param('storeId') storeId: number) {
        return await this.productStoreService.deleteStoreFromProduct(productId, storeId);
    }
}