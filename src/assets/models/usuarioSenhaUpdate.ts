export class UsuarioSenhaUpdate {
    constructor(
        public senhaAtual: string,
        public novaSenha: string,
        public senhaConfirmacao: string,
    ) { }
}