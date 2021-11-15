import { Paciente } from "./paciente.model"

export class Atendimento {
    public id: string | undefined
    public fisioterapeutaId: string | undefined
    public pacienteId: string | undefined
    public data: string | undefined
    public hora: string | undefined
    public estado: string | undefined
    public relato: string | undefined

    constructor(id: string, fisioterapeutaId: string, pacienteId: string, data: string, hora: string, estado: string, relato: string) {
        this.id = id
        this.fisioterapeutaId = fisioterapeutaId
        this.pacienteId = pacienteId
        this.data = data
        this.hora = hora
        this.estado = estado
        this.relato = relato
    }
}