import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
export class StoreDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly city: number;

    @IsString()
    @IsNotEmpty()
    readonly address: string;
}