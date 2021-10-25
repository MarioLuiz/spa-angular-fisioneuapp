import { Injectable } from "@angular/core";
import { Paciente } from "src/assets/models/paciente.model";

@Injectable({ providedIn: 'root' })
export class UpdatePacienteService {

    private pacienteUpdate: Paciente | undefined

    constructor() { }

    setUpdatePaciente(pacienteUpdate: Paciente) {
        this.pacienteUpdate = pacienteUpdate;
    }

    getUpdatePaciente() {
        return this.pacienteUpdate;
    }

    cleanUpdatePaciente() {
        this.pacienteUpdate = undefined;
    }
}