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

    public relatorioAtendimento(filtro: FiltroRelatorioAtendimento): Observable<any> { //FiltroRelatorioAtendimento
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })

        let params = new HttpParams()
        // .set("atendimentoDataInicial", filtro.atendimentoDataInicial)
        // .set("atendimentoDataFinal", filtro.atendimentoDataFinal)
        // .set("atendminetoNomePaciente", filtro.atendminetoNomePaciente)
        // .set("atendimentoNomeFisioterapeuta", filtro.atendimentoNomeFisioterapeuta)

        let options = {
            headers: headers,
            observe: "response" as 'body',
            //body: JSON.stringify(filtro)
            //params: params
        }

        return this.http.post(`${URL_API}/relatorios/atendimentos`, JSON.stringify(filtro), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }

    public relatorioPaciente(filtro: FiltroRelatorioPaciente): Observable<any> { //FiltroRelatorioAtendimento
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })

        let params = new HttpParams()
        // .set("atendimentoDataInicial", filtro.atendimentoDataInicial)
        // .set("atendimentoDataFinal", filtro.atendimentoDataFinal)
        // .set("atendminetoNomePaciente", filtro.atendminetoNomePaciente)
        // .set("atendimentoNomeFisioterapeuta", filtro.atendimentoNomeFisioterapeuta)

        let options = {
            headers: headers,
            observe: "response" as 'body',
            //body: JSON.stringify(filtro)
            //params: params
        }

        return this.http.post(`${URL_API}/relatorios/pacientes`, JSON.stringify(filtro), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }
}