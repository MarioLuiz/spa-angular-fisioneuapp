export class Paginacao {
    constructor(
        public page: number = 0,
        public linesPerPage: number = 24,
        public orderBy: string = 'nome',
        public direction: string = 'ASC',
    ){}
}