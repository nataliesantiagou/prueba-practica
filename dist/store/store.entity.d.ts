import { ProductEntity } from "../product/product.entity";
export declare class StoreEntity {
    id: number;
    name: string;
    city: string;
    address: string;
    products: ProductEntity[];
}
