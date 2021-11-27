import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import { UserSession } from 'src/assets/models/user-session.model';
import { SessionService } from 'src/app/session.service';
import { PacienteService } from 'src/app/paciente.service';
import { Paciente } from 'src/assets/models/paciente.model';
import { UpdatePacienteService } from '../update-paciente.service';


@Component({
  selector: 'fisio-cadastro-edicao-paciente',
  templateUrl: './cadastro-edicao-paciente.component.html',
  styleUrls: ['./cadastro-edicao-paciente.component.scss'],
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
export class CadastroEdicaoPacienteComponent implements OnInit {

  public mensagensErroRegistro: string[] = [];
  public estadoAnimacaoPainelCadastro: string = 'void';
  public botaoCadastro: boolean = false;
  public mensagemCadastroRealizado: string = '';
  public paciente: Paciente | undefined;
  public updatePaciente: boolean = false;
  public podeVisualizarSeuAtendimento: boolean = false;

  private userSession: UserSession | undefined;

  public formulario: FormGroup = new FormGroup({
    'nome': new FormControl(null, [Validators.required]),
    'email': new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(254),
    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    'telefone': new FormControl(null, [Validators.required, Validators.minLength(8)]),
    'cpf': new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11),
    Validators.pattern("^[0-9]*$")]),
    'dataNascimento': new FormControl(null, [Validators.required]), //^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$
    'podeVisualizarSeuAtendimento': new FormControl(null, [Validators.required])
  })

  constructor(
    private sessionService: SessionService,
    private pacienteService: PacienteService,
    private updatePacienteService: UpdatePacienteService
  ) { }

  ngOnInit(): void {
    this.userSession = this.sessionService.getUserSession()
    this.paciente = this.updatePacienteService.getUpdatePaciente()
    //console.log('Paciente recebido: ', this.paciente)
    if (this.paciente) {
      this.updatePaciente = true;
      this.atualizarCamposFormulario()
    }
  }

  cadastrarPaciente(): void {
    this.mensagemCadastroRealizado = ''
    // console.log(this.formulario)
    if (this.userSession) {
      let paciente: Paciente = new Paciente(
        this.paciente?.id ? this.paciente?.id : '',
        this.userSession?.id,
        this.formulario.value.nome,
        this.formulario.value.email,
        this.formulario.value.telefone,
        this.formulario.value.cpf,
        this.formulario.value.dataNascimento,
        this.formulario.value.podeVisualizarSeuAtendimento
      )
      //console.log('Paciente: ', paciente)
      this.pacienteService.cadastrarPaciente(paciente)
        .pipe(
          catchError(err => {
            return throwError(err);
          })
        )
        .subscribe(
          resposta => {
            console.log('Paciente salvo com sucesso', resposta)
            this.mensagemCadastroRealizado = 'Paciente ' + this.formulario.value.nome + ' salvo com sucesso'
          },
          (err: any) => {
            console.log('Erro ao salvar Paciente: ', err)
            this.mensagensErroRegistro = []
            err.error.errors.forEach((mensagemErro: any) => {
              this.mensagensErroRegistro.push(mensagemErro.fieldName + ' : ' + mensagemErro.message);
            });
            this.estadoAnimacaoPainelCadastro = 'criado'
          }
        )
    }
  }

  atualizarPaciente(): void {
    this.mensagemCadastroRealizado = ''
    // console.log(this.formulario)
    if (this.userSession) {
      let paciente: Paciente = new Paciente(
        this.paciente?.id ? this.paciente?.id : '',
        this.userSession?.id,
        this.formulario.value.nome,
        this.formulario.value.email,
        this.formulario.value.telefone,
        this.formulario.value.cpf,
        this.formulario.value.dataNascimento,
        this.formulario.value.podeVisualizarSeuAtendimento
      )
      //console.log('Paciente: ', paciente)
      this.pacienteService.atualizarPaciente(paciente)
        .pipe(
          catchError(err => {
            return throwError(err);
          })
        )
        .subscribe(
          resposta => {
            console.log('Paciente atualizado com sucesso', resposta)
            this.mensagemCadastroRealizado = 'Paciente ' + this.formulario.value.nome + ' atualizado com sucesso'
          },
          (err: any) => {
            console.log('Erro ao salvar Paciente: ', err)
            this.mensagensErroRegistro = []
            err.error.errors.forEach((mensagemErro: any) => {
              this.mensagensErroRegistro.push(mensagemErro.fieldName + ' : ' + mensagemErro.message);
            });
            this.estadoAnimacaoPainelCadastro = 'criado'
          }
        )
    }
  }

  public onCardChange(event: any): void {
    //console.log('evento', event)
    this.estadoAnimacaoPainelCadastro = 'void'
    setTimeout(() => {
      if (this.f.nome.invalid && this.f.nome.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.email.invalid && this.f.email.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.telefone.invalid && this.f.telefone.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.cpf.invalid && this.f.cpf.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.dataNascimento.invalid && this.f.dataNascimento.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
    }, 750)
  }

  public habilitaBotaoCadastro(): boolean {
    if (this.f.nome.invalid || this.f.email.invalid || this.f.cpf.invalid || this.f.dataNascimento.invalid) {
      this.botaoCadastro = true
    } else {
      this.botaoCadastro = false
    }
    return this.botaoCadastro
  }

  public atualizarCamposFormulario(): void {
    this.podeVisualizarSeuAtendimento = this.paciente?.podeVisualizarSeuAtendimento ? this.paciente?.podeVisualizarSeuAtendimento : false;
    this.formulario.get("nome")?.setValue(this.paciente?.nome)
    this.formulario.get("email")?.setValue(this.paciente?.email)
    this.formulario.get("telefone")?.setValue(this.paciente?.telefone)
    this.formulario.get("cpf")?.setValue(this.paciente?.cpf)
    if (this.paciente?.dataNascimento) {
      this.formulario.get("dataNascimento")?.setValue(this.conversorData(this.paciente?.dataNascimento))
    }
    this.formulario.get("podeVisualizarSeuAtendimento")?.setValue(this.paciente?.podeVisualizarSeuAtendimento)
    this.formulario.markAllAsTouched()
    //console.log('Formulario', this.formulario)
  }

  public conversorData(dataNaoConvertida: string): string {
    //(yyyy-mm-dd)
    let meio: string[] = (dataNaoConvertida).split(' ')
    let data: string = meio[0]
    let datas: string[] = (data).split('/')
    let dataConvertida = datas[2] + '-' + datas[1] + '-' + datas[0]
    return dataConvertida
  }

  public cancelarAtualizacaoCadastro() {
    this.updatePaciente = false;
    this.updatePacienteService.cleanUpdatePaciente();
    this.limparCamposFormulario();
  }

  public limparCamposFormulario() {
    this.formulario.get("nome")?.setValue('')
    this.formulario.get("email")?.setValue('')
    this.formulario.get("telefone")?.setValue('')
    this.formulario.get("cpf")?.setValue('')
    this.formulario.get("dataNascimento")?.setValue('')
    this.formulario.markAsUntouched();
  }

  // conveniente getter para facil acesso dos campos do formulario
  get f() { return this.formulario.controls; }

  get senhaConfirmacao(): AbstractControl {
    return this.formulario.controls['senhaConfirmacao'];
  }

  get senha(): AbstractControl {
    return this.formulario.controls['senha'];
  }
}
