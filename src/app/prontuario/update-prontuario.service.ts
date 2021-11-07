import { Injectable } from "@angular/core";
import { Prontuario } from "src/assets/models/prontuario.model";

@Injectable({ providedIn: 'root' })
export class UpdateProntuarioService {

    private prontuarioUpdate: Prontuario | undefined

    constructor() { }

    setUpdateProntuario(prontuarioUpdate: Prontuario) {
        this.prontuarioUpdate = prontuarioUpdate;
    }

    getUpdateProntuario() {
        return this.prontuarioUpdate;
    }

    cleanUpdateProntuario() {
        this.prontuarioUpdate = undefined;
    }
}