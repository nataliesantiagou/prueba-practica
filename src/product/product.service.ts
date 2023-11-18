import { HttpStatus, Injectable } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from '../exceptions/business.exception';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({ relations: ['stores'] });
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['stores'],
    });
    if (!product)
      throw new BusinessException(
        `El producto con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    return product;
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    if (product.type != 'PRECEDERO' && product.type != 'NO PRECEDERO') {
      throw new BusinessException(
          `El tipo de producto debe ser PRECEDERO o NO PRECEDERO`,
          HttpStatus.PRECONDITION_FAILED,
      );
    }
    return await this.productRepository.save(product);
  }

  async update(id: number, product: ProductEntity): Promise<ProductEntity> {
    const persistedProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['stores'],
    });
    if (!persistedProduct) {
      throw new BusinessException(
        `El producto con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (product.type != 'PRECEDERO' && product.type != 'NO PRECEDERO') {
      throw new BusinessException(
          `El tipo de producto debe ser PRECEDERO o NO PRECEDERO`,
          HttpStatus.PRECONDITION_FAILED,
      );
    }

    return await this.productRepository.save({
      ...persistedProduct,
      ...product,
    });
  }

  async delete(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new BusinessException(
        `El producto con id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.productRepository.remove(product);
  }
}
