import { Paciente } from "./paciente.model"

export class Prontuario {
    public id: string | undefined
    public pacienteId: string | undefined
    public numero: string | undefined
    public cid: string | undefined
    public cif: string | undefined
    public observacao: string | undefined
    public dataCadastro: string | undefined
    public paciente: Paciente | undefined

    constructor(id: string, pacienteId: string, numero: string, cid: string, cif: string, observacao: string) {
        this.id = id
        this.pacienteId = pacienteId
        this.numero = numero
        this.cid = cid
        this.cif = cif
        this.observacao = observacao
    }
}