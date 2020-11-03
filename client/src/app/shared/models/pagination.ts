import { IProducts } from './products';

export interface IPagination {

    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProducts[];

}

export class Pagination implements IPagination{
    pageIndex: number;
    pageSize: number;
    count: number;
    data: IProducts[] = [];

}
