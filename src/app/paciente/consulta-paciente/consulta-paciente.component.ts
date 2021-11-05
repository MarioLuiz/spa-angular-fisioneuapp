import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Paginacao } from 'src/assets/models/paginacao.model';
import { PacienteService } from 'src/app/paciente.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators'
import { PageableResponse } from 'src/assets/models/pageableResponse.model';
import { Pageable } from 'src/assets/models/pageable.model';
import { Sort } from 'src/assets/models/sort.model';
import { UpdatePacienteService } from '../update-paciente.service';
import { Paciente } from 'src/assets/models/paciente.model';
import { Router } from '@angular/router';

@Component({
  selector: 'fisio-consulta-paciente',
  templateUrl: './consulta-paciente.component.html',
  styleUrls: ['./consulta-paciente.component.scss']
})
export class ConsultaPacienteComponent implements OnInit, AfterViewInit {

  pageableResponse: PageableResponse = new PageableResponse();
  palavraDaPesquisa: string = '';
  pageable: Pageable = new Pageable(0, 0, 8, true, new Sort(false, true, false), false);
  mensagensErroConsulta: string[] = [];
  paginacao: Paginacao = new Paginacao(0, 8, 'nome', 'ASC');
  paciente: Paciente | undefined;
  pacienteExcluir: Paciente | undefined;

  pacientes: any[] = [];
  p: number = 0;

  //pacientes: Observable<any> | undefined
  //private subjectPesquisa: Subject<string> = new Subject<string>()

  constructor(
    private pacienteService: PacienteService,
    private updatePacienteService: UpdatePacienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    /*
    this.pacientes = this.subjectPesquisa.pipe( //retorno Pacientes[]
      debounceTime(1000), // Executa a ação do switchMap após 1 segundo
      distinctUntilChanged(), // previne pesquisa de termo identico ao termo anteriormente pesquisado
      switchMap((termo: string) => {
        
        if (termo.trim() === '') {
          // retorna um observable de array de 'pacientes' vazio
          return of<any[]>([])
        }
        

        return this.pacienteService.consultarPacientesPaginado(this.paginacao, termo)
      }),
      catchError((erro: any, observable: Observable<any[]>) => {
        console.log('Erro ao Pesquisar oferta: ', erro)
        return observable
      })
    )
    */
  }

  ngAfterViewInit() {
    // this.subjectPesquisa.next(this.termoDaPesquisa)
    // console.log('Pacientes: ', this.pacientes)
    this.pesquisa();
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

  alterarPaciente(paciente: any) {
    this.paciente = new Paciente(paciente.id, '', paciente.nome, paciente.email, paciente.telefone, paciente.cpf, paciente.dataNascimento);
    //console.log('Paciente: ', this.paciente)
    this.updatePacienteService.setUpdatePaciente(this.paciente)
    //console.log('UpdatePaciente: ', this.updatePacienteService.getUpdatePaciente())
    this.router.navigate(['fisio/cadastrar-paciente'])
  }

  public guardarPacienteExcluir(pacienteExclusao: Paciente) {
    this.pacienteExcluir = pacienteExclusao;
    console.log('Paciente a Excluir: ', this.pacienteExcluir);
  }

  public excluirPaciente() {
    this.pacienteService.excluirPaciente(this.pacienteExcluir?.id ? this.pacienteExcluir?.id : '')
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          console.log('Paciente Excluido com sucesso', resposta);
          this.pesquisa();
        },
        (err: any) => {
          console.log('Erro ao excluir Paciente: ', err)
          this.mensagensErroConsulta = []
          err.error.errors.forEach((mensagemErro: any) => {
            this.mensagensErroConsulta.push(mensagemErro.fieldName + ' : ' + mensagemErro.message);
          });
          //this.estadoAnimacaoPainelCadastro = 'criado'
        }
      )
  }

  public retiraHorarioData(dataComHorario: string): string {
    let datas: string[] = dataComHorario.split(' ');
    let data: string = datas[0];
    return data
  }

}
