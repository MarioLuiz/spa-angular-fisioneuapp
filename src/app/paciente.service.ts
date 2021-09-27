import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { Paciente } from "src/assets/models/paciente.model";
import { URL_API } from './app.api';

@Injectable()
export class PacienteService {

    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    private options = {
        headers: this.headers
    }

    constructor(
        private http: HttpClient
    ) { }

    public cadastrarPaciente(paciente: Paciente): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })
        let options = {
            headers: headers,
            observe: "response" as 'body'
        }
        return this.http.post(`${URL_API}/pacientes`, JSON.stringify(paciente), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }

}