import { Routes } from "@angular/router";
import { AcessoComponent } from "./acesso/acesso.component";
import { AutenticacaoGuardService } from "./autenticacao-guard.service";
import { HomeComponent } from "./home/home.component";

export const ROUTES: Routes = [
    {path:'', component: AcessoComponent},
    {path:'fisio', component:HomeComponent, canActivate: [AutenticacaoGuardService]}
]