import { Injectable } from "@angular/core";
import { Atendimento } from "src/assets/models/atendimento.model";
import { Paciente } from "src/assets/models/paciente.model";

@Injectable({ providedIn: 'root' })
export class UpdateAtendimentoService {

    private atedimentoUpdate: Atendimento | undefined
    private pacienteUpdate: Paciente | undefined

    constructor() { }

    setUpdateAtendimento(atedimentoUpdate: Atendimento) {
        this.atedimentoUpdate = atedimentoUpdate;
    }

    getUpdateAtendimento() {
        return this.atedimentoUpdate;
    }

    setUpdatePaciente(pacienteUpdate: Paciente) {
        this.pacienteUpdate = pacienteUpdate;
    }

    getUpdatePaciente() {
        return this.pacienteUpdate;
    }

    cleanUpdate() {
        this.atedimentoUpdate = undefined;
        this.pacienteUpdate = undefined;
    }
}