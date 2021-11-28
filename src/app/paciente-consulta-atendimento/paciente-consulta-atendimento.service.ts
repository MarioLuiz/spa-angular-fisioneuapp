import { Injectable } from "@angular/core";
import { Paciente } from "src/assets/models/paciente.model";
import { Prontuario } from "src/assets/models/prontuario.model";

@Injectable({ providedIn: 'root' })
export class PacienteConsultaAtendimentoService {

    private pacienteConsultaAtendimento: Paciente | undefined

    constructor() { }

    setPacienteConsultaAtendimento(paciente: Paciente) {
        this.pacienteConsultaAtendimento = paciente;
    }

    getPacienteConsultaAtendimento() {
        return this.pacienteConsultaAtendimento;
    }

    cleanPacienteConsultaAtendimento() {
        this.pacienteConsultaAtendimento = undefined;
    }
}