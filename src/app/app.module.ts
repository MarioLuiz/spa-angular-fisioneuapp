import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask'
import { NgxPaginationModule } from 'ngx-pagination';

import { ROUTES } from './app.routes'

import { AutenticacaoService } from './autenticacao.service';
import { AutenticacaoGuardService } from './autenticacao-guard.service';
import { FisioterapeutaService } from './fisioterapeuta.service';
import { SessionService } from './session.service';
import { PacienteService } from './paciente.service';

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
import { CadastroPacienteComponent } from './paciente/cadastro-paciente/cadastro-paciente.component';
import { ConsultaPacienteComponent } from './paciente/consulta-paciente/consulta-paciente.component';
import { EdicaoPacienteComponent } from './paciente/edicao-paciente/edicao-paciente.component';

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
    CadastroPacienteComponent,
    ConsultaPacienteComponent,
    EdicaoPacienteComponent
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
    RouterModule.forRoot(ROUTES)
  ],
  providers: [AutenticacaoService, AutenticacaoGuardService, FisioterapeutaService, SessionService, PacienteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
