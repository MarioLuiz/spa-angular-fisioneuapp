import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/operators';
import { AutenticacaoService } from 'src/app/autenticacao.service';

@Component({
  selector: 'fisio-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.component.html',
  styleUrls: ['./esqueci-minha-senha.component.scss'],
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
export class EsqueciMinhaSenhaComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public estadoAnimacaoPainelRecuperarSenha: string = 'void'
  public mensagemErroForgotMyPassword: string = ''
  public mensagemSucessoForgotMyPassword: string = ''

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(254),
    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
  })
  constructor(private autenticacaoService: AutenticacaoService) { }

  ngOnInit(): void {
    // this.formulario.get("email")?.setValue('mario@gmail.com')
  }

  // conveniente getter para facil acesso dos campos do formulario
  get f() { return this.formulario.controls; }

  public onCardChange(event: any): void {
    //console.log('evento', event)
    this.estadoAnimacaoPainelRecuperarSenha = 'void'
    setTimeout(() => {
      if (this.f.email.invalid && this.f.email.touched) {
        this.estadoAnimacaoPainelRecuperarSenha = 'criado'
      }
    }, 750)
  }

  public exibirPainelLogin(): void {
    this.exibirPainel.emit('login')
  }

  public recuperarSenha(): void {
    this.autenticacaoService.recuperarSenha(this.formulario.value.email)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          this.mensagemErroForgotMyPassword = ''
          this.mensagemSucessoForgotMyPassword = ''
          this.mensagemSucessoForgotMyPassword = 'Email enviado com nova senha, por favor verifique seu e-mail'
          console.log('Email com nova senha enviado com sucesso')
        },
        (err: any) => {
          this.mensagemErroForgotMyPassword = ''
          this.mensagemSucessoForgotMyPassword = ''
          console.log('Erro ao recuperar senha: ', err)
          if (err.error.message) {
            this.mensagemErroForgotMyPassword = err.error.message
          } else {
            this.mensagemErroForgotMyPassword = err.error.msg
          }
          
        }
      )
  }

}
