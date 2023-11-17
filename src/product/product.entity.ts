import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {StoreEntity} from "../store/store.entity";

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  type: string;

  @ManyToMany(() => StoreEntity, store => store.products)
  stores: StoreEntity[];

}
