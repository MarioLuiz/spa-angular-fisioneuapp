export class Usuario {
    constructor(
        public nomeCompleto: string,
        public email: string,
        public numeroTelefone: string,
        public cpf: string,
        public crefito: string,
        public senha: string,
        public dataNascimento: Date,
        public dataCadastro: Date
    ){}
}