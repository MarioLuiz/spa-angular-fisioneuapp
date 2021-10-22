import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { FisioterapeutaService } from 'src/app/fisioterapeuta.service';
import { UsuarioSenhaUpdate } from 'src/assets/models/usuarioSenhaUpdate.model';
import { SessionService } from '../../session.service';
import { UserSession } from 'src/assets/models/user-session.model';

@Component({
  selector: 'fisio-edicao-senha-fisioterapeuta',
  templateUrl: './edicao-senha-fisioterapeuta.component.html',
  styleUrls: ['./edicao-senha-fisioterapeuta.component.scss'],
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
export class EdicaoSenhaFisioterapeutaComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public mensagensErroRegistro: string[] = []
  public estadoAnimacaoPainelCadastro: string = 'void'
  public botaoCadastro: boolean = false
  public mensagemSenhaAtualizada: string = ''

  private userSession: UserSession | undefined

  public formulario: FormGroup = new FormGroup({
    'senhaAtual': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    'novaSenha': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    'senhaConfirmacao': new FormControl(null, [Validators.required, Validators.minLength(6)]),
  })

  constructor(
    private fisioterapeutaService: FisioterapeutaService,
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    this.userSession = this.sessionService.getUserSession()
  }

  mudarSenha(): void {
    // console.log(this.formulario)
    this.mensagemSenhaAtualizada = ''
    let usuario: UsuarioSenhaUpdate = new UsuarioSenhaUpdate(
      this.formulario.value.senhaAtual,
      this.formulario.value.novaSenha,
      this.formulario.value.senhaConfirmacao,
    )
    //console.log('Usuario: ', usuario)
    if (this.userSession) {
      this.fisioterapeutaService.editarSenhaFisioterapeuta(usuario, this.userSession.id)
        .pipe(
          catchError(err => {
            return throwError(err);
          })
        )
        .subscribe(
          resposta => {
            console.log('Senha atualizada com sucesso', resposta)
            this.mensagemSenhaAtualizada = 'Senha atualizada com sucesso'
          },
          (err: any) => {
            console.log('Erro ao atualizar senha Fisioterapeuta: ', err)
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
      if (this.f.senhaAtual.invalid && this.f.senhaAtual.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.senhaConfirmacao.invalid && this.f.senhaConfirmacao.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }

    }, 750)
  }

  public habilitaBotaoEdicao(): boolean {
    if (this.f.senhaAtual.invalid || this.f.novaSenha.invalid || this.f.senhaConfirmacao.invalid) {
      this.botaoCadastro = true
    } else {
      this.botaoCadastro = false
    }
    return this.botaoCadastro
  }

  onPasswordChange() {
    if (this.senhaConfirmacao.value == this.novaSenha.value) {
      this.senhaConfirmacao.setErrors(null);
    } else {
      this.senhaConfirmacao.setErrors({ mismatch: true });
    }
  }

  // conveniente getter para facil acesso dos campos do formulario
  get f() { return this.formulario.controls; }

  get senhaConfirmacao(): AbstractControl {
    return this.formulario.controls['senhaConfirmacao'];
  }

  get novaSenha(): AbstractControl {
    return this.formulario.controls['novaSenha'];
  }


}
