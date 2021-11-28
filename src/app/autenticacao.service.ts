import { URL_API } from './app.api';
import { Injectable } from '@angular/core';
import { Usuario } from '../assets/models/usuario.model';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, retry, share } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { FisioterapeutaService } from './fisioterapeuta.service';
import { UserSession } from 'src/assets/models/user-session.model';
import { SessionService } from './session.service';

@Injectable()
export class AutenticacaoService {

    public token_id: string | null | undefined
    public email: string | null | undefined

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
    })
    private options = {
        headers: this.headers
    }
    constructor(
        private router: Router,
        private http: HttpClient,
        private fisioterapeutaService: FisioterapeutaService,
        private sessionService: SessionService) { }

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

                    this.email = email;
                    localStorage.setItem('idToken', token)
                    localStorage.setItem('email', email)
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
            this.email = localStorage.getItem('email')
        }

        if (this.token_id === undefined) {
            this.router.navigate(['/'])
        }

        if (this.email === undefined) {
            this.router.navigate(['/'])
        }

        if (this.sessionService.getUserSession() === undefined) {
            this.salvarSessaoUsuario()
        }

        return this.token_id !== undefined
    }

    public sair(): void {
        localStorage.removeItem('idToken')
        localStorage.removeItem('email')
        this.token_id = undefined
        this.email = undefined
        this.router.navigate(['/'])
    }

    private salvarSessaoUsuario(): void {
        //console.log('email', this.email)
        if (this.email) {
            this.fisioterapeutaService.consultarSessaoFisioterapeuta(this.email)
                .pipe(
                    catchError(err => {
                        return throwError(err);
                    })
                )
                .subscribe(
                    resposta => {
                        //console.log('consultarSessaoFisioterapeuta', resposta)
                        let sessao: UserSession = new UserSession(resposta.id, resposta.email, resposta.perfis)
                        this.sessionService.setUserSession(sessao)
                        //console.log('Sessao', sessao)
                    },
                    (err: any) => {
                        console.log('Erro ao salvarSessaoUsuario: ', err)
                        this.sair();
                    }
                )
        }
    }

    public autenticarComoPaciente(cpf: string, prontuario: string): Observable<any> {
        let options = {
            headers: this.headers,
            observe: "response" as 'body'
        }
        let userLogin = {
            cpf,
            prontuario
        }
        return this.http.post(`${URL_API}/loginComoPaciente`, JSON.stringify(userLogin), options)
            .pipe(
                //share(),
                map((resposta: any) => {
                    console.log('Resposta autenticarComoPaciente', resposta)
                }),
                retry(3)
            )
    }

}