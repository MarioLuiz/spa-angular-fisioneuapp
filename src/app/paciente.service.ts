import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { Paciente } from "src/assets/models/paciente.model";
import { URL_API } from './app.api';

@Injectable()
export class PacienteService {

    

}