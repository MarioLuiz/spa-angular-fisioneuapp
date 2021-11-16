import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { Atendimento } from "src/assets/models/atendimento.model";
import { Paginacao } from "src/assets/models/paginacao.model";
import { URL_API } from "./app.api";

@Injectable()
export class AtendimentoService {
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    private options = {
        headers: this.headers
    }

    constructor(
        private http: HttpClient
    ) { }

    public cadastrarAtendimento(atendimento: Atendimento): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })
        let options = {
            headers: headers,
            observe: "response" as 'body'
        }
        return this.http.post(`${URL_API}/atendimentos`, JSON.stringify(atendimento), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }

    public consultarAtendimentosPorNomePacientePaginado(paginacao: Paginacao, termo: string): Observable<any> {
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

        return this.http.get(`${URL_API}/atendimentos/page`, options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }

}
