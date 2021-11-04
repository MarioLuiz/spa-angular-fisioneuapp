import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import { Paginacao } from "src/assets/models/paginacao.model";
import { Prontuario } from "src/assets/models/prontuario.model";
import { URL_API } from "./app.api";


@Injectable()
export class ProntuarioService {

    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    private options = {
        headers: this.headers
    }

    constructor(
        private http: HttpClient
    ) { }

    public cadastrarProntuario(prontuario: Prontuario): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })
        let options = {
            headers: headers,
            observe: "response" as 'body'
        }
        return this.http.post(`${URL_API}/prontuarios`, JSON.stringify(prontuario), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }

    public consultarProntuariosPaginado(paginacao: Paginacao, termo: string): Observable<any> {
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

        return this.http.get(`${URL_API}/prontuarios/page`, options).pipe(
            map((resposta: any) => resposta),
            retry(3)
        )
    }
}