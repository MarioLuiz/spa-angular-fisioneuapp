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
import { AtendimentoService } from 'src/app/atendimento.service';
import { Atendimento } from 'src/assets/models/atendimento.model';
import { UpdateAtendimentoService } from '../update-atendimento.service';


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
  public atendimento: Atendimento | undefined;
  public updateAtendimento: boolean = false;
  public numeroProntuario: string = ''
  public pacienteSelecionado: any;

  paginacao: Paginacao = new Paginacao(0, 5, 'nome', 'ASC');
  palavraDaPesquisa: string = '';
  pageableResponse: PageableResponse = new PageableResponse();
  mensagensErroConsulta: string[] = []

  pageable: Pageable = new Pageable(0, 0, 8, true, new Sort(false, true, false), false);
  pacientes: any[] = [];
  p: number = 0;

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
    private updateAtendimentoService: UpdateAtendimentoService,
    private atendimentoService: AtendimentoService,
  ) { }

  ngOnInit(): void {
    this.atendimento = this.updateAtendimentoService.getUpdateAtendimento();
    if (this.atendimento) {
      this.updateAtendimento = true;
      this.pacienteSelecionado = this.updateAtendimentoService.getUpdatePaciente();
      console.log('this.atendimento: ', this.atendimento)
      //console.log('this.paciente: ', this.paciente)
      this.atualizarCamposFormulario()
    }
    this.pesquisa();
  }

  ngAfterViewInit() {
    //this.pesquisa();
  }

  cadastrarAtendimento(): void {

    this.mensagemCadastroRealizado = ''
    let atendimento = new Atendimento(
      '',
      this.sessionService.getUserSession()?.id ? this.sessionService.getUserSession()?.id : '',
      this.pacienteSelecionado.id, this.converteDataDiaMesAnoTrocaTracoPorBarra(this.formulario.value.data),
      this.formulario.value.hora,
      this.formulario.value.estado,
      this.formulario.value.relato
    );
    //console.log('Atendimento', atendimento);
    this.atendimentoService.cadastrarAtendimento(atendimento)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          console.log('Atendimento registrado com sucesso', resposta)
          this.mensagemCadastroRealizado = 'Atendimento registrado com sucesso!'
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

  atualizarAtendimento(): void {
    this.mensagemCadastroRealizado = ''

    let atendimento = new Atendimento(
      this.atendimento?.id ? this.atendimento?.id : '',
      this.atendimento?.fisioterapeutaId ? this.atendimento?.fisioterapeutaId : '',
      this.pacienteSelecionado.id,
      this.converteDataDiaMesAnoTrocaTracoPorBarra(this.formulario.value.data),
      this.formulario.value.hora,
      this.formulario.value.estado,
      this.formulario.value.relato
    );
    //console.log('Atendimento: ', atendimento)
    this.atendimentoService.atualizarAtendimento(atendimento)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          console.log('Atendimento atualizado com sucesso', resposta)
          this.mensagemCadastroRealizado = 'Atendimento do paciente' + this.pacienteSelecionado.nome + ' atualizado com sucesso'
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
      if (this.f.paciente.invalid && this.f.paciente.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.data.invalid && this.f.data.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.hora.invalid && this.f.hora.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.estado.invalid && this.f.estado.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.relato.invalid && this.f.relato.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
    }, 750)
  }

  public habilitaBotaoCadastro(): boolean {
    if (this.f.paciente.invalid || this.f.data.invalid || this.f.hora.invalid || this.f.estado.invalid || this.f.relato.invalid) {
      this.botaoCadastro = true
    } else {
      this.botaoCadastro = false
    }
    return this.botaoCadastro
  }

  public atualizarCamposFormulario(): void {
    // this.atendimento 
    this.formulario.get("paciente")?.setValue(this.pacienteSelecionado)
    this.formulario.get("data")?.setValue(this.conversorData(this.atendimento?.data ? this.atendimento?.data : ''));
    this.formulario.get("hora")?.setValue(this.atendimento?.hora)
    this.formulario.get("estado")?.setValue(this.atendimento?.estado)
    this.formulario.get("relato")?.setValue(this.atendimento?.relato)
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
    this.updateAtendimento = false;
    this.updateAtendimentoService.cleanUpdate();
    this.limparCamposFormulario();
  }

  public limparCamposFormulario() {
    this.pacienteSelecionado = undefined
    this.formulario.get("paciente")?.setValue('')
    this.formulario.get("data")?.setValue('')
    this.formulario.get("hora")?.setValue('')
    this.formulario.get("estado")?.setValue('')
    this.formulario.get("relato")?.setValue('')
    this.formulario.markAsUntouched();
  }

  pesquisa() {
    //console.log('Termo Pesquisado: ', this.palavraDaPesquisa)
    this.pacienteService.consultarPacientesComProntuarioPaginado(this.paginacao, this.palavraDaPesquisa)
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
    this.formulario.get("paciente")?.setValue(paciente)
    this.palavraDaPesquisa = this.pacienteSelecionado.nome
    console.log('PacienteSelecionado', this.pacienteSelecionado);
  }

  public retiraHorarioData(dataComHorario: string): string {
    let datas: string[] = dataComHorario.split(' ');
    let data: string = datas[0];
    return data
  }

  public converteDataDiaMesAnoTrocaTracoPorBarra(dataNaoConvertida: string): string {
    //(yyyy-mm-dd)
    let datas: string[] = (dataNaoConvertida).split('-')
    let dataConvertida = datas[2] + '/' + datas[1] + '/' + datas[0]
    return dataConvertida //(dd/mm/yyyy)
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
