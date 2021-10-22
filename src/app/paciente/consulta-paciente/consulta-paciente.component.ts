import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Paginacao } from 'src/assets/models/paginacao.model';
import { PacienteService } from 'src/app/paciente.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators'
import { PageableResponse } from 'src/assets/models/pageableResponse.model';
import { Pageable } from 'src/assets/models/pageable.model';
import { Sort } from 'src/assets/models/sort.model';

@Component({
  selector: 'fisio-consulta-paciente',
  templateUrl: './consulta-paciente.component.html',
  styleUrls: ['./consulta-paciente.component.scss']
})
export class ConsultaPacienteComponent implements OnInit, AfterViewInit {

  pageableResponse: PageableResponse = new PageableResponse()
  palavraDaPesquisa: string = ''
  pageable: Pageable = new Pageable(0, 0, 8, true, new Sort(false, true, false), false)
  mensagensErroConsulta: string[] = []
  paginacao: Paginacao = new Paginacao(0, 8, 'nome', 'ASC')

  true: boolean = true
  pacientes: any[] = []
  p: number = 0;

  //pacientes: Observable<any> | undefined
  //private subjectPesquisa: Subject<string> = new Subject<string>()

  constructor(
    private pacienteService: PacienteService
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
    console.log('Termo Pesquisado: ', this.palavraDaPesquisa)
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

}
