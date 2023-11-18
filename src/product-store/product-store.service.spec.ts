import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import {ProductEntity} from "../product/product.entity";
import {StoreEntity} from "../store/store.entity";
import {ProductStoreService} from "./product-store.service";

describe('ProductStoreService', () => {

    let service: ProductStoreService;
    let repositoryProduct: Repository<ProductEntity>;
    let repositoryStore: Repository<StoreEntity>;
    let product: ProductEntity;
    let storeList: StoreEntity[];
    let store: StoreEntity;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [ProductStoreService],
        }).compile();

        service = module.get<ProductStoreService>(ProductStoreService);
        repositoryProduct = module.get<Repository<ProductEntity>>(
            getRepositoryToken(ProductEntity),
        );
        repositoryStore = module.get<Repository<StoreEntity>>(
            getRepositoryToken(StoreEntity),
        );
        await seedData();
    });

    const seedData = async () => {
        await repositoryProduct.clear();
        await repositoryStore.clear();

        storeList = [];
        for (let i = 0; i < 5; i++) {
            const store = await repositoryStore.save({
                name: faker.commerce.productName(),
                city: faker.string.alpha({ length: 3, casing: 'upper' }),
                address: faker.location.streetAddress(),
            });
            storeList.push(store);
        }

        product = await repositoryProduct.save({
            name: faker.commerce.productName(),
            price: Number(faker.commerce.price()),
            type: faker.helpers.arrayElement(['PRECEDERO', 'NO PRECEDERO']),
            stores: storeList,
        });

        store = await repositoryStore.save({
            id: 6,
            name: faker.commerce.productName(),
            city: faker.string.alpha({ length: 3, casing: 'upper' }),
            address: faker.location.streetAddress(),
        });
    };

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('addStoreToProduct should add a store to a product', async () => {
        const result: ProductEntity = await service.addStoreToProduct(product.id, storeList[0].id);
        expect(result).not.toBeNull();
        expect(result.stores).toHaveLength(6);
    });

    it('addStoreToProduct should throw an exception for an invalid product', async () => {
        await expect(() => service.addStoreToProduct(0, storeList[0].id)).rejects.toHaveProperty(
            'message',
            'El producto con id 0 no existe',
        );
    });

    it('addStoreToProduct should throw an exception for an invalid store', async () => {
        await expect(() => service.addStoreToProduct(product.id, 0)).rejects.toHaveProperty(
            'message',
            'La tienda con id 0 no existe',
        );
    });

    it('findStoresFromProduct should return stores by product', async ()=>{
        const stores: StoreEntity[] = await service.findStoresFromProduct(product.id);
        expect(stores.length).toBe(5)
    });

    it('findStoresFromProduct should throw an exception for an invalid product', async () => {
        await expect(()=> service.findStoresFromProduct(0)).rejects.toHaveProperty(
            'message', 'El producto con id 0 no existe');
    });

    it('findStoreFromProduct should return a store by product and store', async ()=>{
        const store: StoreEntity = await service.findStoreFromProduct(product.id, storeList[0].id);
        expect(store).not.toBeNull();
        expect(store.id).toEqual(storeList[0].id);
    });

    it('findStoreFromProduct should throw an exception for an invalid product', async () => {
        await expect(()=> service.findStoreFromProduct(0, storeList[0].id)).rejects.toHaveProperty(
            'message', 'El producto con id 0 no existe');
    });

    it('findStoreFromProduct should throw an exception for an invalid store', async () => {
        await expect(()=> service.findStoreFromProduct(product.id, 0)).rejects.toHaveProperty(
            'message', 'La tienda con id 0 no existe');
    });

    it('findStoreFromProduct should throw an exception for an invalid store in a product', async () => {
        await expect(()=> service.findStoreFromProduct(product.id, store.id)).rejects.toHaveProperty(
            'message', 'La tienda con id 6 no existe en el producto con id 1');
    });

    it('updateStoresFromProduct should associate recipes to a restaurant', async () => {
        const storedProduct = product;
        const store = await repositoryStore.save({
            name: faker.commerce.productName(),
            city: faker.string.alpha({ length: 3, casing: 'upper' }),
            address: faker.location.streetAddress(),
        });
        const result = await service.updateStoresFromProduct(storedProduct.id, [store]);
        expect(result).not.toBeNull();
        expect(result.stores).not.toBeNull();
        expect(result.stores).toHaveLength(1);
        expect(result.stores[0].id).toEqual(store.id);
        expect(result.stores[0].name).toEqual(store.name);
        expect(result.stores[0].city).toEqual(store.city);
        expect(result.stores[0].address).toEqual(store.address);
    });

    it('updateStoresFromProduct should throw an exception when product does not exist', async () => {
        const store = await repositoryStore.save({
            name: faker.commerce.productName(),
            city: faker.string.alpha({ length: 3, casing: 'upper' }),
            address: faker.location.streetAddress(),
        });
        await expect(()=> service.updateStoresFromProduct(0, [store])).rejects.toHaveProperty(
            'message', 'El producto con id 0 no existe');
    });

    it('deleteStoreFromProduct should delete store from a product', async () => {
        const storedProduct = product;
        const store = storeList[0];
        const result = await service.deleteStoreFromProduct(storedProduct.id, store.id);

        const findProduct = await repositoryProduct.findOne({where: {id: storedProduct.id}, relations: ['stores']});
        const deletedStore = findProduct.stores.find((storedStore) => storedStore.id == store.id);

        expect(deletedStore).toBeUndefined();

    });

    it('deleteStoreFromProduct should throw an exception when product does not exist', async () => {
        const store = storeList[0];
        await expect(()=> service.deleteStoreFromProduct(0, store.id)).rejects.toHaveProperty(
            'message', 'El producto con id 0 no existe');
    });

    it('deleteStoreFromProduct should throw an exception when store does not exist', async () => {
        const storedProduct = product;
        await expect(()=> service.deleteStoreFromProduct(storedProduct.id, 0)).rejects.toHaveProperty(
            'message', 'La tienda con id 0 no existe');
    });

    it('deleteStoreFromProduct should throw an exception when store does not exist in a product', async () => {
        const storedProduct = product;
        await expect(()=> service.deleteStoreFromProduct(storedProduct.id, store.id)).rejects.toHaveProperty(
            'message', 'La tienda con id 6 no tiene asociación con el producto con id 1');
    });

});