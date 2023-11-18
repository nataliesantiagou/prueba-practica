import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '../exceptions/business.exception';
import {StoreEntity} from "./store.entity";

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async findAll(): Promise<StoreEntity[]> {
    return await this.storeRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<StoreEntity> {
    const store: StoreEntity = await this.storeRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!store)
      throw new BusinessException(
        `La tienda con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    return store;
  }

  async create(store: StoreEntity): Promise<StoreEntity> {
    if (store.city.length !== 3) {
      throw new BusinessException(
          `La ciudad debe ser una cadena de 3 caracteres ej. SMR, BOG, MED`,
          HttpStatus.PRECONDITION_FAILED,
      );
    }
    return await this.storeRepository.save(store);
  }

  async update(id: number, store: StoreEntity): Promise<StoreEntity> {
    const persistedStore = await this.storeRepository.findOne({
        where: { id },
        relations: ['products'],
    });
    if (!persistedStore) {
      throw new BusinessException(
        `La tienda con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (typeof store.city === 'string' && store.city.length === 2) {
      throw new BusinessException(
          `La ciudad debe ser una cadena de 3 caracteres`,
          HttpStatus.PRECONDITION_FAILED,
      );
    }

    return await this.storeRepository.save({
      ...persistedStore,
      ...store,
    });
  }

  async delete(id: number): Promise<void> {
    const persistedStore = await this.storeRepository.findOne({
      where: { id },
    });
    if (!persistedStore) {
      throw new BusinessException(
        `La tienda con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.storeRepository.delete(id);
  }
}