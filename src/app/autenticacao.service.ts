import { URL_API } from './app.api';
import { Injectable } from '@angular/core';
import { Usuario } from '../assets/models/usuario.model';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { retry, share } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable()
export class AutenticacaoService {

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

    public cadastrarUsuario(usuario: Usuario): Observable<any> {
        return this.http.post(`${URL_API}/fisioterapeutas`, JSON.stringify(usuario), this.options).pipe(
            map((resposta: any) => resposta),
            retry(3)
            //catchError((e: any) => Observable.throw(this.errorHandler(e)))
        )
    }

    errorHandler(error: any): void {
        console.log('Erro:', error)
    }

    public autenticar(email: string, senha: string): Observable<any> {
        let options = {
            headers: this.headers,
            observe: "response" as 'body'
        }
        let userLogin = {
            email,
            senha
        }
        return this.http.post(`${URL_API}/login`, JSON.stringify(userLogin), options)
            .pipe(
                //share(),
                map((resposta: any) => {
                    let token: string = ''
                    token = resposta.headers.get('Authorization');
                    this.token_id = token;
                    localStorage.setItem('idToken', token)
                    //console.log('Token:', this.token_id)
                    //console.log('Login response', resposta)
                }),
                retry(3)
            )
    }

    public recuperarSenha(email: string): Observable<any> {
        let options = {
            headers: this.headers,
            observe: "response" as 'body'
        }
        let user = {
            email
        }
        return this.http.post(`${URL_API}/auth/forgot/`, JSON.stringify(user), options)
            .pipe(
                //share(),
                map((resposta: any) => {
                    //console.log('Recuperar senha response', resposta)
                }),
                retry(3)
            )
    }

    public autenticado(): boolean {
        if (this.token_id === undefined && localStorage.getItem('idToken') != null) {
            this.token_id = localStorage.getItem('idToken')
        }

        if (this.token_id === undefined) {
            this.router.navigate(['/'])
        }
        return this.token_id !== undefined
    }

    public sair(): void {
        localStorage.removeItem('idToken')
        this.token_id = undefined
        this.router.navigate(['/'])
    }

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
                    console.log('consultarSessaoFisioterapeuta', resposta)
                }),
                retry(3)
            )
    }

}