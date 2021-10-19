import { Sort } from './sort.model';
export class Pageable {
    offset!: number;
    pageNumber!: number;
    pageSize!: number;
    paged!: boolean;
    sort!: Sort;
    unpaged!: boolean;
    constructor(
        offset: number,
        pageNumber: number,
        pageSize: number,
        paged: boolean,
        sort: Sort,
        unpaged: boolean
    ) { }
}