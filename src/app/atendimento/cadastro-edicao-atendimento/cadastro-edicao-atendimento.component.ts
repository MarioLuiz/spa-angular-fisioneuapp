import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import { UserSession } from 'src/assets/models/user-session.model';
import { SessionService } from 'src/app/session.service';
import { PacienteService } from 'src/app/paciente.service';
import { Paciente } from 'src/assets/models/paciente.model';
import { Paginacao } from 'src/assets/models/paginacao.model';
import { PageableResponse } from 'src/assets/models/pageableResponse.model';
import { Pageable } from 'src/assets/models/pageable.model';
import { Sort } from 'src/assets/models/sort.model';
import { ProntuarioService } from 'src/app/prontuario.service';
import { Prontuario } from 'src/assets/models/prontuario.model';
import { UpdateProntuarioService } from 'src/app/prontuario/update-prontuario.service';


@Component({
  selector: 'fisio-cadastro-edicao-atendimento',
  templateUrl: './cadastro-edicao-atendimento.component.html',
  styleUrls: ['./cadastro-edicao-atendimento.component.scss'],
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
export class CadastroEdicaoAtendimentoComponent implements OnInit, AfterViewInit {

  public mensagensErroRegistro: string[] = [];
  public estadoAnimacaoPainelCadastro: string = 'void';
  public botaoCadastro: boolean = false;
  public mensagemCadastroRealizado: string = '';
  public paciente: Paciente | undefined;
  public prontuario: Prontuario | undefined;
  public updateProntuario: boolean = false;
  public numeroProntuario: string = ''
  public pacienteSelecionado: any;

  paginacao: Paginacao = new Paginacao(0, 5, 'nome', 'ASC');
  palavraDaPesquisa: string = '';
  pageableResponse: PageableResponse = new PageableResponse();
  mensagensErroConsulta: string[] = []

  pageable: Pageable = new Pageable(0, 0, 8, true, new Sort(false, true, false), false);
  pacientes: any[] = [];
  p: number = 0;

  private userSession: UserSession | undefined;

  public formulario: FormGroup = new FormGroup({
    'paciente': new FormControl(null, [Validators.required]),
    'data': new FormControl(null, [Validators.required]),
    'hora': new FormControl(null, [Validators.required]),
    'estado': new FormControl(null, [Validators.required]),
    'relato': new FormControl(null, [Validators.required])
  })

  constructor(
    private sessionService: SessionService,
    private pacienteService: PacienteService,
    private prontuarioService: ProntuarioService,
    private updateProntuarioService: UpdateProntuarioService
  ) { }

  ngOnInit(): void {
    this.userSession = this.sessionService.getUserSession()
    this.prontuario = this.updateProntuarioService.getUpdateProntuario()
    if (this.prontuario) {
      this.updateProntuario = true;
      console.log('this.prontuario: ', this.prontuario)
      this.atualizarCamposFormulario()
    }
    this.pesquisa();
  }

  ngAfterViewInit() {
    //this.pesquisa();
  }

  cadastrarProntuario(): void {
    this.mensagemCadastroRealizado = ''

    let prontuario = new Prontuario('', this.pacienteSelecionado.id, this.formulario.value.numeroProntuario, this.formulario.value.cid, this.formulario.value.cif, this.formulario.value.observacao);

    this.prontuarioService.cadastrarProntuario(prontuario)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          console.log('Prontuario criado com sucesso', resposta)
          this.mensagemCadastroRealizado = 'Prontuario ' + this.formulario.value.numeroProntuario + ' salvo com sucesso'
          this.pesquisa()
          this.limparCamposFormulario()
        },
        (err: any) => {
          console.log('Erro ao salvar Prontuario: ', err)
          this.mensagensErroRegistro = []
          err.error.errors.forEach((mensagemErro: any) => {
            this.mensagensErroRegistro.push(mensagemErro.fieldName + ' : ' + mensagemErro.message);
          });
          this.estadoAnimacaoPainelCadastro = 'criado'
        }
      )
  }

  atualizarProntuario(): void {
    this.mensagemCadastroRealizado = ''

    let prontuario: Prontuario = new Prontuario(
      this.prontuario?.id ? this.prontuario.id : '', '', '', this.formulario.value.cid, this.formulario.value.cif, this.formulario.value.observacao
    );
    //console.log('Prontuario: ', prontuario)
    this.prontuarioService.atualizarProntuario(prontuario)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          console.log('Prontuario atualizado com sucesso', resposta)
          this.mensagemCadastroRealizado = 'Prontuario ' + this.formulario.value.numeroProntuario + ' atualizado com sucesso'
        },
        (err: any) => {
          console.log('Erro ao atualizar Prontuario: ', err)
          this.mensagensErroRegistro = []
          err.error.errors.forEach((mensagemErro: any) => {
            this.mensagensErroRegistro.push(mensagemErro.fieldName + ' : ' + mensagemErro.message);
          });
          this.estadoAnimacaoPainelCadastro = 'criado'
        }
      )
  }

  public onCardChange(event: any): void {
    //console.log('evento', event)
    this.estadoAnimacaoPainelCadastro = 'void'
    setTimeout(() => {
      if (this.f.numeroProntuario.invalid && this.f.numeroProntuario.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
    }, 750)
  }

  public habilitaBotaoCadastro(): boolean {
    if (this.f.numeroProntuario.invalid) {
      this.botaoCadastro = true
    } else {
      this.botaoCadastro = false
    }
    return this.botaoCadastro
  }

  public atualizarCamposFormulario(): void {
    this.numeroProntuario = this.prontuario?.numero ? this.prontuario?.numero : ''
    this.formulario.get("cid")?.setValue(this.prontuario?.cid)
    this.formulario.get("cif")?.setValue(this.prontuario?.cif)
    this.formulario.get("observacao")?.setValue(this.prontuario?.observacao)
    this.formulario.get("numeroProntuario")?.setValue(this.numeroProntuario)
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
    this.updateProntuario = false;
    this.updateProntuarioService.cleanUpdateProntuario();
    this.limparCamposFormulario();
  }

  public limparCamposFormulario() {
    this.numeroProntuario = ''
    this.formulario.get("cid")?.setValue('')
    this.formulario.get("cif")?.setValue('')
    this.formulario.get("observacao")?.setValue('')
    this.formulario.get("numero")?.setValue('')
    this.formulario.markAsUntouched();
  }

  pesquisa() {
    //console.log('Termo Pesquisado: ', this.palavraDaPesquisa)
    this.pacienteService.consultarPacientesSemProntuarioPaginado(this.paginacao, this.palavraDaPesquisa)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          this.pageableResponse = resposta.body
          //console.log('Pacientes', this.pageableResponse)
          this.validaCamposPaginacao()
        },
        (err: any) => {
          console.log('Erro ao salvar Paciente: ', err)
          this.mensagensErroConsulta = []
          err.error.errors.forEach((mensagemErro: any) => {
            this.mensagensErroConsulta.push(mensagemErro.fieldName + ' : ' + mensagemErro.message);
          });
          //this.estadoAnimacaoPainelCadastro = 'criado'
        }
      )
  }

  validaCamposPaginacao() {
    if (this.pageableResponse.content) {
      this.pacientes = this.pageableResponse.content
    }
    if (this.pageableResponse.pageable) {
      this.pageable = this.pageableResponse.pageable
    }
    if (this.pageableResponse.number) {
      this.pageableResponse.number = this.pageableResponse.number + 1
    }
  }

  mudarPagina(evento: any) {
    //console.log('Evento: ', evento)
    this.paginacao.page = evento - 1
    this.pesquisa()
  }

  selecionarPaciente(paciente: any) {
    this.pacienteSelecionado = paciente;
    console.log('PacienteSelecionado', this.pacienteSelecionado);
    this.criarNumeroProntuario();
  }

  criarNumeroProntuario() {
    let data: Date = new Date();
    let ano: string = data.getFullYear().toString();
    let mes: string = (data.getMonth() + 1).toString();
    let dia: string = data.getDate().toString();
    let dataAnoMesDia: string = ano + mes + dia;
    this.numeroProntuario = dataAnoMesDia + this.pacienteSelecionado.id;
    this.formulario.get("numeroProntuario")?.setValue(this.numeroProntuario)
  }

  public retiraHorarioData(dataComHorario: string): string {
    let datas: string[] = dataComHorario.split(' ');
    let data: string = datas[0];
    return data
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
