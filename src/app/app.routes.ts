import { Routes } from "@angular/router";
import { AcessoComponent } from "./acesso/acesso.component";
import { AutenticacaoGuardService } from "./autenticacao-guard.service";
import { HomeComponent } from "./home/home.component";
import { EdicaoCadastroFisioterapeutaComponent } from './edicao-cadastro-fisioterapeuta/edicao-cadastro-fisioterapeuta.component';
import { EdicaoSenhaFisioterapeutaComponent } from './edicao-senha-fisioterapeuta/edicao-senha-fisioterapeuta.component';
import { CadastroPacienteComponent } from "./cadastro-paciente/cadastro-paciente.component";
import { ConsultaPacienteComponent } from './consulta-paciente/consulta-paciente.component';

export const ROUTES: Routes = [
    { path: '', component: AcessoComponent },
    {
        path: 'fisio', component: HomeComponent, canActivate: [AutenticacaoGuardService],
        children: [
            { path: '', component: HomeComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'atualizar-cadastro-fisioterapeuta', component: EdicaoCadastroFisioterapeutaComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'atualizar-senha-fisioterapeuta', component: EdicaoSenhaFisioterapeutaComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'cadastrar-paciente', component: CadastroPacienteComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'consultar-pacientes', component: ConsultaPacienteComponent, canActivate: [AutenticacaoGuardService] }
        ]
    }
]