import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "../product/product.entity";

@Entity()
export class StoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @ManyToMany(() => ProductEntity, product => product.stores)
  products: ProductEntity[];
}
