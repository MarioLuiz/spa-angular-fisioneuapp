import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Paginacao } from 'src/assets/models/paginacao.model';
import { PacienteService } from '../paciente.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators'
import { PageableResponse } from 'src/assets/models/pageableResponse.model';

@Component({
  selector: 'fisio-consultar-pacientes',
  templateUrl: './consultar-pacientes.component.html',
  styleUrls: ['./consultar-pacientes.component.scss']
})
export class ConsultarPacientesComponent implements OnInit, AfterViewInit {

  pageableResponse: PageableResponse = new PageableResponse()
  palavraDaPesquisa: string = ''
  mensagensErroConsulta: string[] = []
  paginacao: Paginacao = new Paginacao();
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
          console.log('Pacientes', this.pageableResponse)
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

}
