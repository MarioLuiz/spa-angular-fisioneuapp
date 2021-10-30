import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import { UserSession } from 'src/assets/models/user-session.model';
import { SessionService } from 'src/app/session.service';
import { PacienteService } from 'src/app/paciente.service';
import { Paciente } from 'src/assets/models/paciente.model';
import { UpdatePacienteService } from 'src/app/paciente/update-paciente.service';
import { Paginacao } from 'src/assets/models/paginacao.model';
import { PageableResponse } from 'src/assets/models/pageableResponse.model';
import { Pageable } from 'src/assets/models/pageable.model';
import { Sort } from 'src/assets/models/sort.model';

@Component({
  selector: 'fisio-cadastro-edicao-prontuario',
  templateUrl: './cadastro-edicao-prontuario.component.html',
  styleUrls: ['./cadastro-edicao-prontuario.component.scss'],
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
export class CadastroEdicaoProntuarioComponent implements OnInit, AfterViewInit {

  public mensagensErroRegistro: string[] = [];
  public estadoAnimacaoPainelCadastro: string = 'void';
  public botaoCadastro: boolean = false;
  public mensagemCadastroRealizado: string = '';
  public paciente: Paciente | undefined;
  public updatePaciente: boolean = false;
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
    'nome': new FormControl(null, [Validators.required]),
    'numeroProntuario': new FormControl(null, [Validators.required, Validators.minLength(8)]),
    'resumo': new FormControl(null, [Validators.required])
  })

  constructor(
    private sessionService: SessionService,
    private pacienteService: PacienteService,
    private updatePacienteService: UpdatePacienteService
  ) { }

  ngOnInit(): void {
    this.userSession = this.sessionService.getUserSession()
    this.paciente = this.updatePacienteService.getUpdatePaciente()
    if (this.paciente) {
      this.updatePaciente = true;
      this.atualizarCamposFormulario()
    }
    this.pesquisa();
  }

  ngAfterViewInit() {
    //this.pesquisa();
  }

  cadastrarProntuario(): void {
    this.mensagemCadastroRealizado = ''
    if (this.userSession) {
      let paciente: Paciente = new Paciente(
        this.paciente?.id ? this.paciente?.id : '',
        this.userSession?.id,
        this.formulario.value.nome,
        this.formulario.value.email,
        this.formulario.value.telefone,
        this.formulario.value.cpf,
        this.formulario.value.dataNascimento
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
        this.formulario.value.dataNascimento
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
      if (this.f.numeroProntuario.invalid && this.f.numeroProntuario.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.resumo.invalid && this.f.resumo.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
    }, 750)
  }

  public habilitaBotaoCadastro(): boolean {
    if (this.f.nome.invalid || this.f.numeroProntuario.invalid || this.f.resumo.invalid) {
      this.botaoCadastro = true
    } else {
      this.botaoCadastro = false
    }
    return this.botaoCadastro
  }

  public atualizarCamposFormulario(): void {
    this.formulario.get("nome")?.setValue(this.paciente?.nome)
    this.formulario.get("email")?.setValue(this.paciente?.email)
    this.formulario.get("telefone")?.setValue(this.paciente?.telefone)
    this.formulario.get("cpf")?.setValue(this.paciente?.cpf)
    if (this.paciente?.dataNascimento) {
      this.formulario.get("dataNascimento")?.setValue(this.conversorData(this.paciente?.dataNascimento))
    }
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

  pesquisa() {
    //console.log('Termo Pesquisado: ', this.palavraDaPesquisa)
    this.pacienteService.consultarPacientesPaginado(this.paginacao, this.palavraDaPesquisa)
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
