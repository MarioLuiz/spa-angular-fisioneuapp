export class UsuarioUpdate {
    constructor(
        public nome: string,
        public cpfOuCnpj: string,
        public email: string,
        public crefito: string,
        public dataNascimento: string
    ){}
}