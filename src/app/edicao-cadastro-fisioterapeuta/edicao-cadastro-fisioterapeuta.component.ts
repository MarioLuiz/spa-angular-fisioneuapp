import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AutenticacaoService } from 'src/app/autenticacao.service';
import { Usuario } from '../../assets/models/usuario.model';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
@Component({
  selector: 'fisio-edicao-cadastro-fisioterapeuta',
  templateUrl: './edicao-cadastro-fisioterapeuta.component.html',
  styleUrls: ['./edicao-cadastro-fisioterapeuta.component.scss'],
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
export class EdicaoCadastroFisioterapeutaComponent implements OnInit {

  @Output() public exibirPainel: EventEmitter<string> = new EventEmitter<string>()

  public mensagensErroRegistro: string[] = []
  public estadoAnimacaoPainelCadastro: string = 'void'
  public botaoCadastro: boolean = false

  public formulario: FormGroup = new FormGroup({
    'nome_completo': new FormControl(null, [Validators.required]),
    'email': new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(254),
    Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    //'telefone': new FormControl(null, [Validators.required, Validators.minLength(8)]),
    'cpf': new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11),
    Validators.pattern("^[0-9]*$")]),
    'crefito': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    'dataNascimento': new FormControl(null, [Validators.required]) //^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$
  })

  constructor(
    private autenticacaoService: AutenticacaoService
  ) { }

  ngOnInit(): void {
    // this.formulario.get("nome_completo")?.setValue('Luiz Flavio')
    // this.formulario.get("email")?.setValue('luiz@gmail.com')
    // this.formulario.get("telefone")?.setValue('67999999999')
    // this.formulario.get("cpf")?.setValue('02999999999')
    // this.formulario.get("crefito")?.setValue('13468457')
    // this.formulario.get("senha")?.setValue('123456')
    // this.formulario.get("senhaConfirmacao")?.setValue('123456')
    // this.formulario.get("dataNascimento")?.setValue(new Date(1992, 1, 24))
    // this.formulario.markAllAsTouched()
    // console.log('Formulario', this.formulario)
  }

  exibirPainelLogin(): void {
    this.exibirPainel.emit('login')
  }

  cadastrarUsuario(): void {
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
      if (this.f.nome_completo.invalid && this.f.nome_completo.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.email.invalid && this.f.email.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      // if (this.f.telefone.invalid && this.f.telefone.touched) {
      //   this.estadoAnimacaoPainelCadastro = 'criado'
      // }
      if (this.f.cpf.invalid && this.f.cpf.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.crefito.invalid && this.f.crefito.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
      if (this.f.dataNascimento.invalid && this.f.dataNascimento.touched) {
        this.estadoAnimacaoPainelCadastro = 'criado'
      }
    }, 750)
  }

  public habilitaBotaoEdicao(): boolean {
    if (this.f.nome_completo.invalid || this.f.email.invalid ||
      this.f.cpf.invalid || this.f.crefito.invalid || this.f.dataNascimento.invalid) {
      this.botaoCadastro = true
    } else {
      this.botaoCadastro = false
    }
    return this.botaoCadastro
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
