import { PaginaInicialComponent } from './home/pagina-inicial/pagina-inicial.component';
import { Routes } from "@angular/router";
import { AcessoComponent } from "./acesso/acesso.component";
import { AutenticacaoGuardService } from "./autenticacao-guard.service";
import { HomeComponent } from "./home/home.component";
import { EdicaoCadastroFisioterapeutaComponent } from './fisioterapeuta/edicao-cadastro-fisioterapeuta/edicao-cadastro-fisioterapeuta.component';
import { EdicaoSenhaFisioterapeutaComponent } from './fisioterapeuta/edicao-senha-fisioterapeuta/edicao-senha-fisioterapeuta.component';
import { CadastroEdicaoPacienteComponent } from "./paciente/cadastro-edicao-paciente/cadastro-edicao-paciente.component";
import { ConsultaPacienteComponent } from './paciente/consulta-paciente/consulta-paciente.component';
import { CadastroEdicaoProntuarioComponent } from "./prontuario/cadastro-edicao-prontuario/cadastro-edicao-prontuario.component";
import { ConsultaProntuarioComponent } from "./prontuario/consulta-prontuario/consulta-prontuario.component";
import { CadastroEdicaoAtendimentoComponent } from "./atendimento/cadastro-edicao-atendimento/cadastro-edicao-atendimento.component";
import { ConsultaAtendimentoComponent } from "./atendimento/consulta-atendimento/consulta-atendimento.component";
import { RelatorioAtendimentoComponent } from './relatorio/relatorio-atendimento/relatorio-atendimento.component';
import { RelatorioPacienteComponent } from './relatorio/relatorio-paciente/relatorio-paciente.component';

export const ROUTES: Routes = [
    { path: '', component: AcessoComponent },
    {
        path: 'fisio', component: HomeComponent, canActivate: [AutenticacaoGuardService],
        children: [
            { path: '', component: PaginaInicialComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'atualizar-cadastro-fisioterapeuta', component: EdicaoCadastroFisioterapeutaComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'atualizar-senha-fisioterapeuta', component: EdicaoSenhaFisioterapeutaComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'cadastrar-paciente', component: CadastroEdicaoPacienteComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'consultar-pacientes', component: ConsultaPacienteComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'cadastrar-editar-prontuario', component: CadastroEdicaoProntuarioComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'consultar-prontuarios', component: ConsultaProntuarioComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'cadastrar-editar-atendimento', component: CadastroEdicaoAtendimentoComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'consultar-atendimentos', component: ConsultaAtendimentoComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'consultar-relatorio-atendimentos', component: RelatorioAtendimentoComponent, canActivate: [AutenticacaoGuardService] },
            { path: 'consultar-relatorio-pacientes', component: RelatorioPacienteComponent, canActivate: [AutenticacaoGuardService] }
        ]
    }
]