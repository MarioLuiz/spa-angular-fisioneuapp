import { Pageable } from "./pageable.model"

export class PageableResponse {
    content: any[] | undefined
    empty: boolean | undefined
    first: boolean | undefined
    last: boolean | undefined
    number: number | undefined
    numberOfElements: number | undefined
    pageable: Pageable | undefined
    size: number | undefined
    totalElements: number | undefined
    totalPages: number | undefined

    constructor(
        // content: any[],
        // empty: boolean,
        // first: boolean,
        // last: boolean,
        // number: number,
        // numberOfElements: number,
        // pageable: Pageable,
        // size: number,
        // totalElements: number,
        // totalPages: number
    ) { }
}