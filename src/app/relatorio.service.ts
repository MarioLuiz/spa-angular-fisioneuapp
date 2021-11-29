import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { FiltroRelatorioAtendimento } from "src/assets/models/filtroRelatorioAtendimento.model";
import { FiltroRelatorioPaciente } from "src/assets/models/filtroRelatorioPaciente.model";
import { URL_API } from "./app.api";

@Injectable()
export class RelatorioService {
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    private options = {
        headers: this.headers
    }

    constructor(
        private http: HttpClient
    ) { }

    public relatorioAtendimento(filtro: FiltroRelatorioAtendimento): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })

        let params = new HttpParams()

        let options = {
            headers: headers,
            observe: "response" as 'body',
        }

        return this.http.post(`${URL_API}/relatorios/atendimentos`, JSON.stringify(filtro), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }

    public relatorioPaciente(filtro: FiltroRelatorioPaciente): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })

        let params = new HttpParams()

        let options = {
            headers: headers,
            observe: "response" as 'body',
        }

        return this.http.post(`${URL_API}/relatorios/pacientes`, JSON.stringify(filtro), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }

    public relatorioAtendimentoPacienteConsulta (idPaciente: String): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })

        let paciente = {
            idPaciente
        }

        let options = {
            headers: headers,
            observe: "response" as 'body',
        }

        return this.http.post(`${URL_API}/relatorios/atendimento-por-paciente`, JSON.stringify(paciente), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }
}