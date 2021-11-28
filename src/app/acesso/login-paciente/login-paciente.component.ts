import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { AutenticacaoService } from 'src/app/autenticacao.service';
import { PacienteService } from 'src/app/paciente.service';
import { PacienteConsultaAtendimentoService } from 'src/app/paciente-consulta-atendimento/paciente-consulta-atendimento.service';
import { Paciente } from 'src/assets/models/paciente.model';

@Component({
  selector: 'fisio-login-paciente',
  templateUrl: './login-paciente.component.html',
  styleUrls: ['./login-paciente.component.scss'],
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
export class LoginPacienteComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public mensagensErroSighIn: Array<string> = []
  public estadoAnimacaoPainelLoginPaciente: string = 'void'

  public formulario: FormGroup = new FormGroup({
    'cpf': new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")]),
    'prontuario': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern("^[0-9]*$")])
  })

  constructor(
    private autenticacaoService: AutenticacaoService,
    private pacienteService: PacienteService,
    private pacienteConsultaAtendimentoService: PacienteConsultaAtendimentoService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public exibirPainelLogin(): void {
    this.exibirPainel.emit('login')
  }

  public autenticar(): void {
    this.mensagensErroSighIn = []

    //console.log('Formulario', this.formulario)
    this.autenticacaoService.autenticarComoPaciente(this.formulario.value.cpf, this.formulario.value.prontuario)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          console.log('Paciente autenticado com sucesso')
          this.salvarPacienteConsultaAtendimento()
          // this.router.navigate(['/paciente-consulta-atendimento'])
        },
        (err: any) => {
          this.mensagensErroSighIn = []
          console.log('Erro ao realizar Login: ', err)
          this.mensagensErroSighIn.push(err.error.msg)
          this.estadoAnimacaoPainelLoginPaciente = 'criado'
        }
      )
  }

  public salvarPacienteConsultaAtendimento(): void {
    this.pacienteService.consultarPacientePorCpfNumeroProntuario(this.formulario.value.cpf, this.formulario.value.prontuario)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          //console.log('Paciente acessado com suscesso', resposta)
          if (resposta) {
            if (resposta.body) {
              let paciente: Paciente = new Paciente(resposta.body.id, '', resposta.body.nome, resposta.body.email, resposta.body.telefone, resposta.body.cpf, resposta.body.dataNascimento, resposta.body.podeVisualizarSeuAtendimento);
              this.pacienteConsultaAtendimentoService.setPacienteConsultaAtendimento(paciente)
              //console.log('pacienteConsultaAtendimentoService: ', this.pacienteConsultaAtendimentoService.getPacienteConsultaAtendimento())
              this.router.navigate(['/paciente-consulta-atendimento'])
            }
          }
        },
        (err: any) => {
          this.mensagensErroSighIn = []
          console.log('Erro ao realizar Login: ', err)
          this.mensagensErroSighIn.push(err.error.msg)
          this.estadoAnimacaoPainelLoginPaciente = 'criado'
        }
      )
  }

  public onCardChange(event: any): void {
    //console.log('evento', event)
    this.estadoAnimacaoPainelLoginPaciente = 'void'
    setTimeout(() => {
      if (this.formulario.controls.prontuario.invalid && this.formulario.controls.prontuario.touched) {
        this.estadoAnimacaoPainelLoginPaciente = 'criado'
      }
      if (this.formulario.controls.cpf.invalid && this.formulario.controls.cpf.touched) {
        this.estadoAnimacaoPainelLoginPaciente = 'criado'
      }
    }, 750)
  }

  // conveniente getter para facil acesso dos campos do formulario
  get f() { return this.formulario.controls; }

}
