import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { RelatorioService } from 'src/app/relatorio.service';
import { FiltroRelatorioAtendimento } from 'src/assets/models/filtroRelatorioAtendimento.model';
import { FiltroRelatorioPaciente } from 'src/assets/models/filtroRelatorioPaciente.model';

@Component({
  selector: 'fisio-relatorio-paciente',
  templateUrl: './relatorio-paciente.component.html',
  styleUrls: ['./relatorio-paciente.component.scss'],
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
export class RelatorioPacienteComponent implements OnInit, AfterViewInit {

  public estadoAnimacaoPainelRelatorioAtendimento: string = 'void';
  public estadoAnimacaoSemResultados: string = 'void';
  public habilitaBotaoPesquisa: boolean = false;
  public habilitaBotaoImpressao: boolean = false;
  public pesquisaFoiRealizada: boolean = false;
  public filtro: FiltroRelatorioPaciente | undefined;
  public mensagensErroRelatorio: string[] = [];
  public pacientes: any[] = [];

  public formulario: FormGroup = new FormGroup({
    'pacienteDataNascimentoInicial': new FormControl(null),
    'pacienteDataNascimentoFinal': new FormControl(null),
    'pacienteDataCadastroInicial': new FormControl(null),
    'pacienteDataCadastroFinal': new FormControl(null),
    'pacienteNome': new FormControl(null),
    'pacienteCpf': new FormControl(null, [Validators.minLength(11), Validators.maxLength(11), Validators.pattern("^[0-9]*$")])
  })

  constructor(
    private relatorioService: RelatorioService
  ) { }

  ngAfterViewInit(): void {
    // this.formulario.get("pacienteDataNascimentoInicial")?.setValue('1800-01-01')
    // this.formulario.get("pacienteDataNascimentoFinal")?.setValue('2021-11-24')
  }

  ngOnInit(): void {
    this.formulario.get("pacienteNome")?.setValue('')
    this.formulario.get("pacienteDataCadastroFinal")?.setValue('')
    this.formulario.get("pacienteDataCadastroInicial")?.setValue('')
    this.formulario.get("pacienteDataNascimentoFinal")?.setValue('')
    this.formulario.get("pacienteDataNascimentoInicial")?.setValue('')
    this.formulario.get("pacienteCpf")?.setValue('')
  }

  public onCardChange(event: any): void {
    //console.log('evento', event)
    this.estadoAnimacaoPainelRelatorioAtendimento = 'void'
    setTimeout(() => {
      if (this.f.pacienteNome.invalid && this.f.pacienteNome.touched) {
        this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
      }
      if (this.f.pacienteDataNascimentoInicial.invalid && this.f.pacienteDataNascimentoInicial.touched) {
        this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
      }
      if (this.f.pacienteDataNascimentoFinal.invalid && this.f.pacienteDataNascimentoFinal.touched) {
        this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
      }
      if (this.f.pacienteDataCadastroInicial.invalid && this.f.pacienteDataCadastroInicial.touched) {
        this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
      }
      if (this.f.pacienteDataCadastroFinal.invalid && this.f.pacienteDataCadastroFinal.touched) {
        this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
      }
      if (this.f.pacienteCpf.invalid && this.f.pacienteCpf.touched) {
        this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
      }
    }, 750)
  }

  public habilitarBotaoPesquisa(): boolean {
    if (this.f.pacienteDataNascimentoInicial.invalid || this.f.pacienteDataNascimentoFinal.invalid ||
      this.f.pacienteDataCadastroInicial.invalid || this.f.pacienteDataCadastroFinal.invalid
      || this.f.pacienteNome.invalid || this.f.pacienteCpf.invalid ) {
        this.habilitaBotaoPesquisa = true
    } else {
      this.habilitaBotaoPesquisa = false
    }
    return this.habilitaBotaoPesquisa
  }

  consultarRelatorio(): void {
    // console.log(this.formulario)
    this.mensagensErroRelatorio = []
    this.estadoAnimacaoPainelRelatorioAtendimento = 'void'
    this.pesquisaFoiRealizada = true
    this.estadoAnimacaoSemResultados = 'void'

    this.filtro = new FiltroRelatorioPaciente(
      this.formulario.value.pacienteDataNascimentoInicial,
      this.formulario.value.pacienteDataNascimentoFinal,
      this.formulario.value.pacienteDataCadastroInicial,
      this.formulario.value.pacienteDataCadastroFinal,
      this.formulario.value.pacienteNome,
      this.formulario.value.pacienteCpf
    )
    console.log('Filtro: ', this.filtro)
    this.relatorioService.relatorioPaciente(this.filtro)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          //console.log('Relatório consultado com sucesso', resposta)
          this.pacientes = resposta.body.content
          if (this.pacientes.length === 0) {
            this.habilitaBotaoImpressao = false
            this.estadoAnimacaoSemResultados = 'criado'
          } else {
            this.habilitaBotaoImpressao = true
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
          this.pacientes= []
          this.habilitaBotaoImpressao = false;
          this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
        }
      )
  }

  imprimeRelatorio(componente: any) {
    //console.log('componente', componente)
    let printContents = document.getElementById(componente ? componente : '')?.innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents ? printContents : '';

    window.print();

    document.body.innerHTML = originalContents;
  }

  public validaCampo(campo: any): string {
    return campo ? campo : '-'
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
