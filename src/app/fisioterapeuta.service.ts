import { URL_API } from './app.api';
import { Injectable } from '@angular/core';
import { Usuario } from '../assets/models/usuario.model';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { retry, share } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable()
export class FisioterapeutaService {

    public token_id: string | null | undefined
    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
    })
    private options = {
        headers: this.headers
    }
    constructor(
        private router: Router,
        private http: HttpClient) { }

    public EditarFisioterapeuta(fisio: Usuario, id:string): Observable<any> {
        return this.http.post(`${URL_API}/fisioterapeutas/${id}`, JSON.stringify(fisio), this.options).pipe(
            map((resposta: any) => resposta),
            retry(3)
            //catchError((e: any) => Observable.throw(this.errorHandler(e)))
        )
    }
    
}