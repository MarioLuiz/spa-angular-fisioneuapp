import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask'
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPrintModule } from 'ngx-print';


import { ROUTES } from './app.routes'

import { AutenticacaoService } from './autenticacao.service';
import { AutenticacaoGuardService } from './autenticacao-guard.service';
import { FisioterapeutaService } from './fisioterapeuta.service';
import { SessionService } from './session.service';
import { PacienteService } from './paciente.service';
import { UpdatePacienteService } from './paciente/update-paciente.service';
import { ProntuarioService } from './prontuario.service';
import { AtendimentoService } from 'src/app/atendimento.service';
import { RelatorioService } from './relatorio.service';
import { PacienteConsultaAtendimentoService } from './paciente-consulta-atendimento/paciente-consulta-atendimento.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcessoComponent } from './acesso/acesso.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './acesso/login/login.component';
import { CadastroComponent } from './acesso/cadastro/cadastro.component';
import { HomeComponent } from './home/home.component';
import { EsqueciMinhaSenhaComponent } from './acesso/esqueci-minha-senha/esqueci-minha-senha.component';
import { TopoComponent } from './home/topo/topo.component';
import { EdicaoCadastroFisioterapeutaComponent } from './fisioterapeuta/edicao-cadastro-fisioterapeuta/edicao-cadastro-fisioterapeuta.component';
import { EdicaoSenhaFisioterapeutaComponent } from './fisioterapeuta/edicao-senha-fisioterapeuta/edicao-senha-fisioterapeuta.component';
import { CadastroEdicaoPacienteComponent } from './paciente/cadastro-edicao-paciente/cadastro-edicao-paciente.component';
import { ConsultaPacienteComponent } from './paciente/consulta-paciente/consulta-paciente.component';
import { PacienteComponent } from './paciente/paciente.component';
import { ProntuarioComponent } from './prontuario/prontuario.component';
import { CadastroEdicaoProntuarioComponent } from './prontuario/cadastro-edicao-prontuario/cadastro-edicao-prontuario.component';
import { ConsultaProntuarioComponent } from './prontuario/consulta-prontuario/consulta-prontuario.component';
import { AtendimentoComponent } from './atendimento/atendimento.component';
import { CadastroEdicaoAtendimentoComponent } from './atendimento/cadastro-edicao-atendimento/cadastro-edicao-atendimento.component';
import { ConsultaAtendimentoComponent } from './atendimento/consulta-atendimento/consulta-atendimento.component';
import { PaginaInicialComponent } from './home/pagina-inicial/pagina-inicial.component';
import { RelatorioComponent } from './relatorio/relatorio.component';
import { RelatorioAtendimentoComponent } from './relatorio/relatorio-atendimento/relatorio-atendimento.component';
import { RelatorioPacienteComponent } from './relatorio/relatorio-paciente/relatorio-paciente.component';
import { LoginPacienteComponent } from './acesso/login-paciente/login-paciente.component';
import { PacienteConsultaAtendimentoComponent } from './paciente-consulta-atendimento/paciente-consulta-atendimento.component';


@NgModule({
  declarations: [
    AppComponent,
    AcessoComponent,
    LoginComponent,
    CadastroComponent,
    HomeComponent,
    EsqueciMinhaSenhaComponent,
    TopoComponent,
    EdicaoCadastroFisioterapeutaComponent,
    EdicaoSenhaFisioterapeutaComponent,
    CadastroEdicaoPacienteComponent,
    ConsultaPacienteComponent,
    PacienteComponent,
    ProntuarioComponent,
    CadastroEdicaoProntuarioComponent,
    ConsultaProntuarioComponent,
    AtendimentoComponent,
    CadastroEdicaoAtendimentoComponent,
    ConsultaAtendimentoComponent,
    PaginaInicialComponent,
    RelatorioComponent,
    RelatorioAtendimentoComponent,
    RelatorioPacienteComponent,
    LoginPacienteComponent,
    PacienteConsultaAtendimentoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxMaskModule.forRoot({
      showMaskTyped: true,
      // clearIfNotMatch : true
    }),
    NgxPaginationModule,
    NgxPrintModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [AutenticacaoService, AutenticacaoGuardService, FisioterapeutaService, SessionService, PacienteService, UpdatePacienteService, ProntuarioService, AtendimentoService, RelatorioService, PacienteConsultaAtendimentoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
