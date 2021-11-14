import { Paciente } from "./paciente.model"

export class Atendimento {
    public id: string | undefined
    public fisioterapeutaId: string | undefined
    public paciente: Paciente | undefined
    public data: string | undefined
    public hora: string | undefined
    public estado: string | undefined
    public relato: string | undefined

    constructor(id: string, fisioterapeutaId: string, paciente: Paciente, data: string, hora: string, estado: string, relato: string) {
        this.id = id
        this.fisioterapeutaId = fisioterapeutaId
        this.paciente = paciente
        this.data = data
        this.hora = hora
        this.estado = estado
        this.relato = relato
    }
}