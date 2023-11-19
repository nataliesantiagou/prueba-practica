import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ProductStoreService} from "./product-store.service";
import {ProductEntity} from "../product/product.entity";
import {StoreEntity} from "../store/store.entity";
import {ProductStoreController} from "./product-store.controller";

@Module({
    providers: [ProductStoreService],
    imports: [TypeOrmModule.forFeature([ProductEntity, StoreEntity])],
    controllers: [ProductStoreController],
})
export class ProductStoreModule {}