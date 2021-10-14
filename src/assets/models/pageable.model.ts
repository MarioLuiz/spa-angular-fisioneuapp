import { Sort } from './sort.model';
export class Pageable {
    constructor(
        offset: number,
        pageNumber: number,
        pageSize: number,
        paged: boolean,
        sort: Sort,
        unpaged: boolean
    ) { }
}