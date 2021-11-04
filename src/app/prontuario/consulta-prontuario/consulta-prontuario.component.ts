import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PacienteService } from 'src/app/paciente.service';
import { UpdatePacienteService } from 'src/app/paciente/update-paciente.service';
import { Paciente } from 'src/assets/models/paciente.model';
import { Pageable } from 'src/assets/models/pageable.model';
import { PageableResponse } from 'src/assets/models/pageableResponse.model';
import { Paginacao } from 'src/assets/models/paginacao.model';
import { Sort } from 'src/assets/models/sort.model';

@Component({
  selector: 'fisio-consulta-prontuario',
  templateUrl: './consulta-prontuario.component.html',
  styleUrls: ['./consulta-prontuario.component.scss']
})
export class ConsultaProntuarioComponent implements OnInit, AfterViewInit {

  pageableResponse: PageableResponse = new PageableResponse();
  palavraDaPesquisa: string = '';
  pageable: Pageable = new Pageable(0, 0, 8, true, new Sort(false, true, false), false);
  mensagensErroConsulta: string[] = [];
  paginacao: Paginacao = new Paginacao(0, 8, 'id', 'ASC');
  paciente: Paciente | undefined;
  pacienteExcluir: Paciente | undefined;

  pacientes: any[] = [];
  p: number = 0;

  constructor(
    private pacienteService: PacienteService,
    private updatePacienteService: UpdatePacienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
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

}
