import { StoreEntity } from "../store/store.entity";
export declare class ProductEntity {
    id: number;
    name: string;
    price: number;
    type: string;
    stores: StoreEntity[];
}
