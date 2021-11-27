import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { RelatorioService } from 'src/app/relatorio.service';
import { FiltroRelatorioAtendimento } from 'src/assets/models/filtroRelatorioAtendimento.model';

@Component({
  selector: 'fisio-relatorio-atendimento',
  templateUrl: './relatorio-atendimento.component.html',
  styleUrls: ['./relatorio-atendimento.component.scss'],
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
export class RelatorioAtendimentoComponent implements OnInit {

  public estadoAnimacaoPainelRelatorioAtendimento: string = 'void';
  public estadoAnimacaoSemResultados: string = 'void';
  public habilitaBotaoPesquisa: boolean = false;
  public habilitaBotaoImpressao: boolean = false;
  public pesquisaFoiRealizada: boolean = false;
  public filtro: FiltroRelatorioAtendimento | undefined;
  public mensagensErroRelatorio: string[] = [];
  public atendimentos: any[] = [];

  public formulario: FormGroup = new FormGroup({
    'atendimentoDataInicial': new FormControl(null, [Validators.required]),
    'atendimentoDataFinal': new FormControl(null, [Validators.required]),
    'atendminetoNomePaciente': new FormControl(null),
    'atendimentoNomeFisioterapeuta': new FormControl(null)
  })

  constructor(
    private relatorioService: RelatorioService
  ) { }

  ngOnInit(): void {
    this.formulario.get("atendminetoNomePaciente")?.setValue('')
    this.formulario.get("atendimentoNomeFisioterapeuta")?.setValue('')
    // this.formulario.get("atendimentoDataInicial")?.setValue('2010-01-01')
    // this.formulario.get("atendimentoDataFinal")?.setValue('2021-11-24')
  }

  public onCardChange(event: any): void {
    //console.log('evento', event)
    this.estadoAnimacaoPainelRelatorioAtendimento = 'void'
    setTimeout(() => {
      if (this.f.atendimentoDataInicial.invalid && this.f.atendimentoDataInicial.touched) {
        this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
      }
      if (this.f.atendimentoDataFinal.invalid && this.f.atendimentoDataFinal.touched) {
        this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
      }
      if (this.f.atendminetoNomePaciente.invalid && this.f.atendminetoNomePaciente.touched) {
        this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
      }
      if (this.f.atendimentoNomeFisioterapeuta.invalid && this.f.atendimentoNomeFisioterapeuta.touched) {
        this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
      }
    }, 750)
  }

  public habilitarBotaoPesquisa(): boolean {
    if (this.f.atendimentoDataInicial.invalid || this.f.atendimentoDataFinal.invalid ||
      this.f.atendminetoNomePaciente.invalid || this.f.atendimentoNomeFisioterapeuta.invalid) {
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
    
    this.filtro = new FiltroRelatorioAtendimento(
      this.formulario.value.atendimentoDataInicial,
      this.formulario.value.atendimentoDataFinal,
      this.formulario.value.atendminetoNomePaciente,
      this.formulario.value.atendimentoNomeFisioterapeuta
    )
    console.log('Filtro: ', this.filtro)
    this.relatorioService.relatorioAtendimento(this.filtro)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          console.log('Relatório consultado com sucesso', resposta)
          this.atendimentos = resposta.body.content
          if (this.atendimentos.length === 0) {
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
          this.atendimentos = []
          this.habilitaBotaoImpressao = false;
          this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
        }
      )
  }

  imprimeRelatorio(componente: any) {
    console.log('componente', componente)
    let printContents = document.getElementById(componente ? componente : '')?.innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents ? printContents : '';

    window.print();

    document.body.innerHTML = originalContents;
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
