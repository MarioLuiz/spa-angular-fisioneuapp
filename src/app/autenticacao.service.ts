import { URL_API } from './app.api';
import { Injectable } from '@angular/core';
import { Usuario } from './acesso/usuario.model';
import firebase from 'firebase';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable()
export class AutenticacaoService {

    public token_id: string | null | undefined
    public token_fireBase: string = ''
    private headers = new HttpHeaders({ 
        'Content-Type': 'application/json',
    })
    private options = {
        headers: this.headers,
    }
    constructor(
        private router: Router,
        private http: HttpClient) {}

    public cadastrarUsuario(usuario: Usuario): Observable<any> {
        return this.http.post(`${URL_API}/fisioterapeutas`, JSON.stringify(usuario), this.options).pipe(
            map((resposta:any) => resposta),
            retry(3)
            //catchError((e: any) => Observable.throw(this.errorHandler(e)))
        )
    }

    errorHandler(error: any): void {
        console.log('Erro:', error)
    }

    public autenticar(email: string, senha: string): Promise<any> {

        return firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((resposta: any) => {
                firebase.auth().currentUser?.getIdToken()
                    .then((idToken: string) => {
                        this.token_id = idToken
                        localStorage.setItem('idToken', this.token_id)
                    })
                // Salvando chave do token database
                let dataBaseUrlFireBase: any = firebase.database().ref()
                this.token_fireBase = 'firebase:host:' + (dataBaseUrlFireBase.database.app.options_.databaseURL).replace("https://", "")
                this.token_fireBase.trim()

                return resposta
            })
    }

    public salvarDadosDoUsuario(dadosUser: any, retry: number): void {

        // registrando dados complementares do usuário no path email na base64
        firebase.database().ref(`usuario_detalhe/${btoa(dadosUser.email)}`)
            .set(dadosUser)
            .then((resposta) => {
                console.log('Dados do usuário salvo com sucesso na base', resposta)
            })
            .catch((error: Error) => {
                console.log('Erro ao salvar dados do usuario BD Firebase', error)
                if (retry > 0) { // Condição para mais tentativas de salvar dados
                    this.salvarDadosDoUsuario(dadosUser, (retry - 1))
                }
            })
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
        firebase.auth().signOut()
            .then(() => {
                localStorage.removeItem('idToken')
                localStorage.removeItem(this.token_fireBase)
                this.token_id = undefined
                this.token_fireBase = ''
                this.router.navigate(['/'])
            })
    }

}