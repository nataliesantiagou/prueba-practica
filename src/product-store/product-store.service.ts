import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "../product/product.entity";
import {Repository} from "typeorm";
import {StoreEntity} from "../store/store.entity";
import {BusinessException} from "../exceptions/business.exception";

@Injectable()
export class ProductStoreService {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        @InjectRepository(StoreEntity)
        private readonly storeRepository: Repository<StoreEntity>,
    ) { }

    async addStoreToProduct(productId: number, storeId: number): Promise<ProductEntity> {
        const product = await this.productRepository.findOne({where: {id: productId}, relations: ['stores']});
        if (!product) {
            throw new BusinessException(
                `El producto con id ${productId} no existe`,
                HttpStatus.NOT_FOUND,
            );
        }

        const store = await this.storeRepository.findOne({where: {id: storeId}});
        if (!store) {
            throw new BusinessException(
                `La tienda con id ${storeId} no existe`,
                HttpStatus.NOT_FOUND,
            );
        }

        product.stores.push(store);
        return await this.productRepository.save(product);
    }

    async findStoresFromProduct(productId: number): Promise<StoreEntity[]>   {
        const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["stores"]});
        if (!product) {
            throw new BusinessException(
                `El producto con id ${productId} no existe`,
                HttpStatus.NOT_FOUND,
            );
        }

        return product.stores;
    }

    async findStoreFromProduct(productId: number, storeId: number): Promise<StoreEntity> {
        const store: StoreEntity = await this.storeRepository.findOne({where: {id: storeId}});
        if (!store) {
            throw new BusinessException(
                `La tienda con id ${storeId} no existe`,
                HttpStatus.NOT_FOUND,
            );
        }

        const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["stores"]});
        if (!product) {
            throw new BusinessException(
                `El producto con id ${productId} no existe`,
                HttpStatus.NOT_FOUND,
            );
        }

        const productStore: StoreEntity = product.stores.find(e => e.id === store.id);

        if (!productStore) {
            throw new BusinessException(
                `La tienda con id ${storeId} no existe en el producto con id ${productId}`,
                HttpStatus.NOT_FOUND,
            );

        }

        return productStore;
    }

    async updateStoresFromProduct(productId: number, stores: StoreEntity[]): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["stores"]});
        if (!product) {
            throw new BusinessException(
                `El producto con id ${productId} no existe`,
                HttpStatus.NOT_FOUND,
            );
        }

        for (let i = 0; i < stores.length; i++) {
            const store: StoreEntity = await this.storeRepository.findOne({where: {id: stores[i].id}});
            if (!store) {
                throw new BusinessException(
                    `La tienda con id ${stores[i].id} no existe`,
                    HttpStatus.NOT_FOUND,
                );
            }
            stores[i] = store;
        }
        product.stores = stores;
        return await this.productRepository.save(product);
    }

    async deleteStoreFromProduct(productId: number, storeId: number){
        const store: StoreEntity = await this.storeRepository.findOne({where: {id: storeId}});
        if (!store) {
            throw new BusinessException(
                `La tienda con id ${storeId} no existe`,
                HttpStatus.NOT_FOUND,
            );
        }

        const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["stores"]});
        if (!product) {
            throw new BusinessException(
                `El producto con id ${productId} no existe`,
                HttpStatus.NOT_FOUND,
            );
        }

        const storeRestaurante = product.stores.find(e => e.id == storeId);
        if (!storeRestaurante) {
            throw new BusinessException(
                `La tienda con id ${storeId} no tiene asociación con el producto con id ${productId}`,
                HttpStatus.PRECONDITION_FAILED,
            );
        }

        product.stores = product.stores.filter(e => e.id != storeId);
        await this.productRepository.save(product)

    }
}