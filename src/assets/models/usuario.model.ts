export class Usuario {
    constructor(
        public nome: string,
        public email: string,
        public cpfOuCnpj: string,
        public crefito: string,
        public senha: string,
        public dataNascimento: Date,
        public dataCadastro: Date
    ){}
}