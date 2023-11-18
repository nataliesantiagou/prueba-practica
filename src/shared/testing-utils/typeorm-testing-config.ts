/* eslint-disable prettier/prettier */
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import {ProductEntity} from "../../product/product.entity";
import {StoreEntity} from "../../store/store.entity";

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductEntity, StoreEntity],
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature([ProductEntity, StoreEntity]),
];
/* archivo src/shared/testing-utils/typeorm-testing-config.ts*/