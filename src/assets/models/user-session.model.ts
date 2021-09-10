export class UserSession {
    constructor(
        public id: string,
        public email: string,
        public perfis: string[],
    ) { }
}