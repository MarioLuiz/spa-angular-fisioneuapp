export class UsuarioUpdate {
    constructor(
        public nome: string,
        public email: string,
        public cpfOuCnpj: string,
        public crefito: string,
        public dataNascimento: string
    ){}
}