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
  public habilitaBotaoPesquisa: boolean = false;
  public filtro: FiltroRelatorioAtendimento | undefined;
  public mensagensErroRelatorio: string[] = [];

  public formulario: FormGroup = new FormGroup({
    'atendimentoDataInicial': new FormControl(null, [Validators.required]),
    'atendimentoDataFinal': new FormControl(null, [Validators.required]),
    'atendminetoNomePaciente': new FormControl(null, [Validators.minLength(3)]),
    'atendimentoNomeFisioterapeuta': new FormControl(null, [Validators.minLength(3)])
  })

  constructor(
    private relatorioService: RelatorioService
  ) { }

  ngOnInit(): void {
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
        },
        (err: any) => {
          console.log('Erro ao consultar Relatório Atendimentos: ', err)
          this.mensagensErroRelatorio = []
          err.error.errors.forEach((mensagemErro: any) => {
            this.mensagensErroRelatorio.push(mensagemErro.fieldName + ' : ' + mensagemErro.message);
          });
          this.estadoAnimacaoPainelRelatorioAtendimento = 'criado'
        }
      )
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
