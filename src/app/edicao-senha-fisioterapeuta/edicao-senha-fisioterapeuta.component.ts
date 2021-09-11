import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AutenticacaoService } from 'src/app/autenticacao.service';
import { Usuario } from '../../assets/models/usuario.model';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

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

  public formulario: FormGroup = new FormGroup({
    'senhaAtual': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    'novaSenha': new FormControl(null, [Validators.required, Validators.minLength(6)]),
    'senhaConfirmacao': new FormControl(null, [Validators.required, Validators.minLength(6)]),
  })

  constructor(
    private autenticacaoService: AutenticacaoService
  ) { }

  ngOnInit(): void {
  }

  exibirPainelLogin(): void {
    this.exibirPainel.emit('login')
  }

  mudarSenha(): void {
    // console.log(this.formulario)
    let usuario: Usuario = new Usuario(
      this.formulario.value.nome_completo,
      this.formulario.value.email,
      //this.formulario.value.telefone,
      this.formulario.value.cpf,
      this.formulario.value.crefito,
      this.formulario.value.senha,
      this.formulario.value.dataNascimento,
      new Date() // Data cadastro
    )
    console.log('Usuario: ', usuario)
    this.autenticacaoService.cadastrarUsuario(usuario)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          console.log('Usuário Salvo com sucesso', resposta)
          this.exibirPainelLogin()
        },
        (err: any) => {
          console.log('Erro ao salvar Fisioterapeuta: ', err)
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
      if (this.f.senha.invalid && this.f.senha.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.senhaConfirmacao.invalid && this.f.senhaConfirmacao.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
    }, 750)
  }

  public habilitaBotaoEdicao(): boolean {
    if (this.f.senha.invalid || this.f.senhaConfirmacao.invalid) {
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
