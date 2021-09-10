import { URL_API } from './app.api';
import {Injectable} from '@angular/core';
import { Usuario } from '../assets/models/usuario.model';
import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { retry, share } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { UserSession } from './../assets/models/user-session.model';

@Injectable({providedIn: 'root'})
export class SessionService {

    private userSession: UserSession = new UserSession('', '', []);

    constructor() { }

    setUserSession(userSession: UserSession) {
        this.userSession = userSession;
    }

    getUserSession() {
        return this.userSession;
    }
}