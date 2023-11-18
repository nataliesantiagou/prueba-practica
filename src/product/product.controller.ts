import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards} from '@nestjs/common';
import {plainToInstance} from "class-transformer";
import {ProductService} from "./product.service";
import {ProductDto} from "./product.dto";
import {ProductEntity} from "./product.entity";

@Controller('products')
export class ProductController {

    constructor(private readonly productService: ProductService) {
    }

    @Get()
    async findAll() {
        return await this.productService.findAll();
    }

    @Get(':productId')
    async findOne(@Param('productId') id: number) {
        return await this.productService.findOne(id);
    }

    @Post()
    async create(@Body() productDto: ProductDto) {
        const product: ProductEntity = plainToInstance(ProductEntity, productDto);
        return await this.productService.create(product);
    }

    @Put(':productId')
    async update(@Param('productId') id: number, @Body() productDto: ProductDto) {
        const product: ProductEntity = plainToInstance(ProductEntity, productDto);
        return await this.productService.update(id, product);
    }

    @Delete(':productId')
    @HttpCode(204)
    async delete(@Param('productId') id: number) {
        return await this.productService.delete(id);
    }

}