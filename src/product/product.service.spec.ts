import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ProductEntity } from './product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repositoryProduct: Repository<ProductEntity>;
  let productList: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repositoryProduct = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    await seedData();
  });

  const seedData = async () => {
    await repositoryProduct.clear();
    productList = [];
    for (let i = 0; i < 5; i++) {
      const product = await repositoryProduct.save({
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price()),
        type: faker.helpers.arrayElement(['PRECEDERO', 'NO PRECEDERO']),
      });
      productList.push(product);
    }
    return productList;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const result: ProductEntity[] = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(5);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct = productList[0];
    const result: ProductEntity = await service.findOne(storedProduct.id);
    expect(result).not.toBeNull();
    expect(result.id).toEqual(storedProduct.id);
  });

  it('findOne should throw an exception when the product does not exist', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty(
      'message',
      'El producto con id 0 no existe',
    );
  });

  it('create should create a product', async () => {
    const product: ProductEntity = {
      id: 0,
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      type: faker.helpers.arrayElement(['PRECEDERO', 'NO PRECEDERO']),
      stores: [],
    };
    const newProduct = await service.create(product);
    expect(newProduct).not.toBeNull();
    expect(newProduct.id).toBeDefined();
    expect(newProduct.name).toEqual(newProduct.name);
    expect(newProduct.price).toEqual(newProduct.price);
    expect(newProduct.type).toEqual(newProduct.type);
  });

  it('create should create a product with different type', async () => {
    const product: ProductEntity = {
      id: 0,
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      type: faker.helpers.arrayElement(['COMESTIBLE', 'NO COMESTIBLE']),
      stores: [],
    };
    await expect(() => service.create(product)).rejects.toHaveProperty(
        'message',
        'El tipo de producto debe ser PRECEDERO o NO PRECEDERO',
    );
  });

  it('update should update a product', async () => {
    const storedProduct = productList[0];
    const product: ProductEntity = {
      id: storedProduct.id,
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      type: faker.helpers.arrayElement(['PRECEDERO', 'NO PRECEDERO']),
      stores: [],
    };
    const updatedProduct = await service.update(storedProduct.id, product);
    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct.id).toEqual(product.id);
    expect(updatedProduct.name).toEqual(product.name);
    expect(updatedProduct.price).toEqual(product.price);
    expect(updatedProduct.type).toEqual(product.type);
  });

  it('update should throw an exception when the product does not exist', async () => {
    const product: ProductEntity = {
      id: 0,
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      type: faker.helpers.arrayElement(['PRECEDERO', 'NO PRECEDERO']),
      stores: [],
    };
    await expect(() => service.update(0, product)).rejects.toHaveProperty(
      'message',
      'El producto con id 0 no existe',
    );
  });

  it('update should throw an exception when the product with different type', async () => {
    const storedProduct = productList[0];
    const product: ProductEntity = {
      id: storedProduct.id,
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      type: faker.helpers.arrayElement(['COMESTIBLE', 'NO COMESTIBLE']),
      stores: [],
    };
    await expect(() => service.update(storedProduct.id, product)).rejects.toHaveProperty(
        'message',
        'El tipo de producto debe ser PRECEDERO o NO PRECEDERO',
    );
  });

  it('delete should delete a product', async () => {
    const storedProduct = productList[0];
    await service.delete(storedProduct.id);
    const deletedProduct = await repositoryProduct.findOne({
      where: { id: storedProduct.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception when the product does not exist', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty(
      'message',
      'El producto con id 0 no existe',
    );
  });
});
