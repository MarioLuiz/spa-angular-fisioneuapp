import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { Paciente } from "src/assets/models/paciente.model";
import { Paginacao } from "src/assets/models/paginacao.model";
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

    public atualizarPaciente(paciente: Paciente): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })
        let options = {
            headers: headers,
            observe: "response" as 'body'
        }
        return this.http.put(`${URL_API}/pacientes`, JSON.stringify(paciente), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }

    public excluirPaciente(pacienteId: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })
        let options = {
            headers: headers,
            observe: "response" as 'body'
        }
        return this.http.delete(`${URL_API}/pacientes/${pacienteId}`, options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }

    public consultarPacientesPaginado(paginacao: Paginacao, termo: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })

        let params = new HttpParams()
            .set("page", paginacao.page)
            .set("linesPerPage", paginacao.linesPerPage)
            .set("orderBy", paginacao.orderBy)
            .set("direction", paginacao.direction)
            .set("nome", termo)

        let options = {
            headers: headers,
            observe: "response" as 'body',
            params: params
        }
        
        return this.http.get(`${URL_API}/pacientes/page/custom`, options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }

}