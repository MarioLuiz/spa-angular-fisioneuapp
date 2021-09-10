import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { AutenticacaoService } from 'src/app/autenticacao.service';
import { FisioterapeutaService } from 'src/app/fisioterapeuta.service';
import { SessionService } from 'src/app/session.service';
import { UserSession } from 'src/assets/models/user-session.model';

@Component({
  selector: 'fisio-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public mensagensErroSighIn: Array<string> = []
  public estadoAnimacaoPainelLogin: string = 'void'

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(254),
    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    'senha': new FormControl(null, [Validators.required, Validators.minLength(6)])
  })

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router,
    private fisioterapeutaService: FisioterapeutaService,
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    // this.formulario.get("email")?.setValue('mario@gmail.com')
    // this.formulario.get("senha")?.setValue('123456Mario')
    // this.formulario.markAllAsTouched()
    // console.log('Formulario', this.formulario)
  }

  // conveniente getter para facil acesso dos campos do formulario
  get f() { return this.formulario.controls; }

  public exibirPainelCadastro(): void {
    this.exibirPainel.emit('cadastro')
  }

  public exibirPainelRecuperarSenha(): void {
    this.exibirPainel.emit('recuperarSenha')
  }

  public autenticar(): void {
    this.mensagensErroSighIn = []
    //console.log('Formulario', this.formulario)
    this.autenticacaoService.autenticar(this.formulario.value.email, this.formulario.value.senha)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          console.log('Usuário autenticado com sucesso')
          this.salvarSessaoUsuario()
          this.router.navigate(['/fisio'])
        },
        (err: any) => {
          this.mensagensErroSighIn = []
          console.log('Erro ao realizar Login: ', err)
          this.mensagensErroSighIn.push(err.error.message)
          this.estadoAnimacaoPainelLogin = 'criado'
        }
      )
  }

  public onCardChange(event: any): void {
    //console.log('evento', event)
    this.estadoAnimacaoPainelLogin = 'void'
    setTimeout(() => {
      if (this.formulario.controls.email.invalid && this.formulario.controls.email.touched) {
        this.estadoAnimacaoPainelLogin = 'criado'
      }
      if (this.formulario.controls.senha.invalid && this.formulario.controls.senha.touched) {
        this.estadoAnimacaoPainelLogin = 'criado'
      }
    }, 750)
  }

  public salvarSessaoUsuario(): void {
    //console.log('Formulario', this.formulario)
    this.fisioterapeutaService.consultarSessaoFisioterapeuta(this.formulario.value.email)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          console.log('consultarSessaoFisioterapeuta', resposta)
          let sessao: UserSession = new UserSession(resposta.id, resposta.email, resposta.perfis)
          this.sessionService.setUserSession(sessao)
          console.log('Sessao', sessao)
        },
        (err: any) => {
          console.log('Erro ao salvarSessaoUsuario: ', err)
        }
      )
  }

}
