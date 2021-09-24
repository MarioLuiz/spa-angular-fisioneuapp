import { URL_API } from './app.api';
import { Injectable } from '@angular/core';
import { Usuario } from '../assets/models/usuario.model';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { retry, share } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { UsuarioUpdate } from 'src/assets/models/usuarioUpdate.model';
import { UsuarioSenhaUpdate } from 'src/assets/models/usuarioSenhaUpdate';

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

    public consultarSessaoFisioterapeuta(email: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })
        let options = {
            headers: headers,
            observe: "response" as 'body'
        }

        return this.http.get(`${URL_API}/fisioterapeutas/email/${email}`, options)
            .pipe(
                //share(),
                map((resposta: any) => {
                    return resposta.body
                    //console.log('consultarSessaoFisioterapeuta', resposta)
                }),
                retry(3)
            )
    }

    public editarFisioterapeuta(fisio: UsuarioUpdate, id: string): Observable<any> {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })
        let options = {
            headers: headers,
            observe: "response" as 'body'
        }
        return this.http.put(`${URL_API}/fisioterapeutas/cadastro/${id}`, JSON.stringify(fisio), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
            //catchError((e: any) => Observable.throw(this.errorHandler(e)))
        )
    }

    public editarSenhaFisioterapeuta(fisio: UsuarioSenhaUpdate, id: string): Observable<any> {     
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('idToken')}`
        })
        let options = {
            headers: headers,
            observe: "response" as 'body'
        }
        return this.http.put(`${URL_API}/fisioterapeutas/senha/${id}`, JSON.stringify(fisio), options).pipe(
            map((resposta: any) => resposta),
            retry(3)
            //catchError((e: any) => Observable.throw(this.errorHandler(e)))
        )
    }
}