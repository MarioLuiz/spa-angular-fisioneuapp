import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { RelatorioService } from 'src/app/relatorio.service';
import { PacienteConsultaAtendimentoService } from './paciente-consulta-atendimento.service';
import { AutenticacaoService } from 'src/app/autenticacao.service';
import { Paciente } from 'src/assets/models/paciente.model';

@Component({
  selector: 'fisio-paciente-consulta-atendimento',
  templateUrl: './paciente-consulta-atendimento.component.html',
  styleUrls: ['./paciente-consulta-atendimento.component.scss'],
  animations: [
    trigger('animacao-painel', [
      state('criado', style({
        opacity: 1
      })),
      transition('void => criado', [
        // 0 void ----X---------------------X--X--X--X-X-X-------X criado 1.5s//
        animate('750ms 0s ease-in-out', keyframes([
          style({ offset: 0.15, opacity: 1, transform: 'translateX(0)' }),
          style({ offset: 0.70, opacity: 1, transform: 'translateX(0)' }),
          style({ offset: 0.75, opacity: 1, transform: 'translateX(-20px)' }),
          style({ offset: 0.80, opacity: 1, transform: 'translateX(20px)' }),
          style({ offset: 0.85, opacity: 1, transform: 'translateX(-20px)' }),
          style({ offset: 0.90, opacity: 1, transform: 'translateX(20px)' }),
          style({ offset: 0.94, opacity: 1, transform: 'translateX(-20px)' }),
          style({ offset: 0.98, opacity: 1, transform: 'translateX(20px)' }),
          style({ offset: 1, opacity: 1, transform: 'translateY(0)' })
        ])) // duração, dalay e aceleração
      ])
    ])
  ]
})
export class PacienteConsultaAtendimentoComponent implements OnInit,AfterViewInit {

  public estadoAnimacaoSemResultados: string = 'void';
  public atendimentos: any[] = [];
  public mensagensErroRelatorio: string[] = [];
  public paciente: Paciente | undefined;
  

  constructor(
    private autenticacaoService: AutenticacaoService,
    private pacienteConsultaAtendimentoService: PacienteConsultaAtendimentoService,
    private relatorioService: RelatorioService,
  ) { }

  ngOnInit(): void {
    console.log('pacienteConsultaAtendimentoService: ', this.pacienteConsultaAtendimentoService.getPacienteConsultaAtendimento())
    this.paciente = this.pacienteConsultaAtendimentoService.getPacienteConsultaAtendimento();
  }

  ngAfterViewInit(): void {
    this.consultarRelatorio();
  }

  consultarRelatorio(): void {
    // console.log(this.formulario)
    this.mensagensErroRelatorio = []
    this.estadoAnimacaoSemResultados = 'void'

    this.relatorioService.relatorioAtendimentoPacienteConsulta(this.paciente?.id ? this.paciente.id : '')
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          //console.log('Relatório consultado com sucesso', resposta)
          this.atendimentos = resposta.body.content
          if (this.atendimentos.length === 0) {
            this.estadoAnimacaoSemResultados = 'criado'
          } else {

          }

        },
        (err: any) => {
          console.log('Erro ao consultar Relatório Atendimentos: ', err)
          if (err.error.errors) {
            err.error.errors.forEach((mensagemErro: any) => {
              this.mensagensErroRelatorio.push(mensagemErro.fieldName + ' : ' + mensagemErro.message);
            });
          } else {
            this.mensagensErroRelatorio.push(err.error.msg)
          }
          this.atendimentos = []
        }
      )
  }

  public sair() {
    this.autenticacaoService.sair();
  }

}
