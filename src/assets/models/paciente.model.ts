export class Paciente {
    public id: string | undefined
    public fisioterapeutaId: string | undefined
    public nome: string | undefined
    public email: string | undefined
    public telefone: string | undefined
    public cpf: string | undefined
    public dataNascimento: string | undefined

    constructor(id: string, fisioterapeutaId: string, nome: string, email: string, telefone: string, cpf: string, dataNascimento: string) {
        this.id = id;
        this.fisioterapeutaId = fisioterapeutaId;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
    }
}