import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import {StoreService} from "./store.service";
import {StoreEntity} from "./store.entity";

describe('StroreService', () => {
    let service: StoreService;
    let repositoryStore: Repository<StoreEntity>;
    let storeList: StoreEntity[];

    beforeEach(async () => {
       const module: TestingModule = await Test.createTestingModule({
         imports: [...TypeOrmTestingConfig()],
         providers: [StoreService],
       }).compile();

       service = module.get<StoreService>(StoreService);
       repositoryStore = module.get<Repository<StoreEntity>>(
           getRepositoryToken(StoreEntity),
       );
       await seedData();
    });

    const seedData = async () => {
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
        return storeList;
    }

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll should return all stores', async () => {
        const result: StoreEntity[] = await service.findAll();
        expect(result).not.toBeNull();
        expect(result).toHaveLength(5);
    });

    it('findOne should return a store by id', async () => {
        const storedStore = storeList[0];
        const result: StoreEntity = await service.findOne(storedStore.id);
        expect(result).not.toBeNull();
        expect(result.id).toEqual(storedStore.id);
    });

    it('findOne should throw an exception when the store does not exist', async () => {
        await expect(() => service.findOne(0)).rejects.toHaveProperty(
            'message',
            'La tienda con id 0 no existe',
        );
    });

    it('create should create a store', async () => {
        const store: StoreEntity = {
            id: 0,
            name: faker.commerce.productName(),
            city: faker.string.alpha({ length: 3, casing: 'upper' }),
            address: faker.location.streetAddress(),
            products: [],
        };
        const result: StoreEntity = await service.create(store);
        expect(result).not.toBeNull();
        expect(result.id).not.toBeNull();
        expect(result.name).toEqual(store.name);
        expect(result.city).toEqual(store.city);
        expect(result.address).toEqual(store.address);
    });

    it('create should create a store with a city code with different length', async () => {
        const store: StoreEntity = {
            id: 0,
            name: faker.commerce.productName(),
            city: 'BO',
            address: faker.location.streetAddress(),
            products: [],
        };
        await expect(() => service.create(store)).rejects.toHaveProperty(
            'message',
            'La ciudad debe ser una cadena de 3 caracteres ej. SMR, BOG, MED',
        );
    });

    it('update should update a store', async () => {
        const storedStore = storeList[0];
        const store: StoreEntity = {
            id: storedStore.id,
            name: faker.commerce.productName(),
            city: faker.string.alpha({ length: 3, casing: 'upper' }),
            address: faker.location.streetAddress(),
            products: [],
        };
        const result: StoreEntity = await service.update(store.id, store);
        expect(result).not.toBeNull();
        expect(result.id).toEqual(store.id);
        expect(result.name).toEqual(store.name);
        expect(result.city).toEqual(store.city);
        expect(result.address).toEqual(store.address);
    });

    it('update should throw an exception when the store does not exist', async () => {
        const store: StoreEntity = {
            id: 0,
            name: faker.commerce.productName(),
            city: faker.string.alpha({ length: 3, casing: 'upper' }),
            address: faker.location.streetAddress(),
            products: [],
        };
        await expect(() => service.update(store.id, store)).rejects.toHaveProperty(
            'message',
            'La tienda con id 0 no existe',
        );
    });

    it('update should throw an exception when the city code has different length', async () => {
        const storedStore = storeList[0];
        const store: StoreEntity = {
            id: storedStore.id,
            name: faker.commerce.productName(),
            city: faker.string.alpha({ length: 2, casing: 'upper' }),
            address: faker.location.streetAddress(),
            products: [],
        };
        await expect(() => service.update(store.id, store)).rejects.toHaveProperty(
            'message',
            'La ciudad debe ser una cadena de 3 caracteres',
        );
    });

    it('delete should delete a store', async () => {
        const storedStore = storeList[0];
        await service.delete(storedStore.id);
        const deletedStore = await repositoryStore.findOne({
            where: { id: storedStore.id },
        });
        expect(deletedStore).toBeNull();
    });

    it('delete should delete a store', async () => {
        await expect(() => service.findOne(0)).rejects.toHaveProperty(
            'message',
            'La tienda con id 0 no existe',
        );
    });

});
