import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PacienteService } from 'src/app/paciente.service';
import { UpdatePacienteService } from 'src/app/paciente/update-paciente.service';
import { ProntuarioService } from 'src/app/prontuario.service';
import { Paciente } from 'src/assets/models/paciente.model';
import { Pageable } from 'src/assets/models/pageable.model';
import { PageableResponse } from 'src/assets/models/pageableResponse.model';
import { Paginacao } from 'src/assets/models/paginacao.model';
import { Prontuario } from 'src/assets/models/prontuario.model';
import { Sort } from 'src/assets/models/sort.model';
import { UpdateProntuarioService } from '../update-prontuario.service';

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
  paginacao: Paginacao = new Paginacao(0, 8, 'dataCriacao', 'ASC');
  paciente: Paciente | undefined;
  prontuario: Prontuario | undefined;
  prontuarioVisualizar: any = new Prontuario('', '', '', '', '', '')
  pacienteVisualizar: Paciente = new Paciente('', '', '', '', '', '', '', false)

  pacientes: any[] = [];
  prontuarios: any[] = [];
  p: number = 0;

  constructor(
    private updatePacienteService: UpdatePacienteService,
    private prontuarioService: ProntuarioService,
    private updateProntuarioService: UpdateProntuarioService,
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
    this.prontuarioService.consultarProntuariosPaginado(this.paginacao, this.palavraDaPesquisa)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          this.pageableResponse = resposta.body
          //console.log('Prontuarios', resposta.body)
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
      this.prontuarios = this.pageableResponse.content
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

  alterarProntuario(prontuario: any) {
    //console.log('Prontuario: ', prontuario)
    this.prontuario = new Prontuario(prontuario.id,prontuario.paciente.id,prontuario.numero,prontuario.cid,prontuario.cif,prontuario.observacao);
    this.prontuario.paciente = prontuario.paciente;
    //console.log('Prontuario: ', this.prontuario)
    this.updateProntuarioService.setUpdateProntuario(this.prontuario)
    //console.log('UpdateProntuario: ', this.updateProntuarioService.getUpdateProntuario())
    this.router.navigate(['fisio/cadastrar-editar-prontuario'])
  }

  public guardarProntuarioVisualizar(prontuarioVisualizar: Prontuario) {
    this.prontuarioVisualizar = prontuarioVisualizar;
    this.pacienteVisualizar = this.prontuarioVisualizar.paciente
    //console.log('Prontuario visualizar: ', this.prontuarioVisualizar);
  }

  public converteDataDiaMesAno(dataNaoConvertida: string): string {
    if (dataNaoConvertida) {
      let dataArray: string[] = dataNaoConvertida.split('T')
      let datas: string[] = (dataArray[0]).split('-')
      let dataConvertida = datas[2] + '/' + datas[1] + '/' + datas[0]
      return dataConvertida
    } else {
      return ''
    }
  }

  public validaCampo(campo: any): string {
    return campo ? campo : '-'
  }

  public retiraHorarioData(dataComHorario: string): string {
    let datas: string[] = dataComHorario.split(' ');
    let data: string = datas[0];
    return data
  }

  public acaoBotaoPesquisa() {
    this.paginacao.page = 0;
    this.pesquisa();
  }

}
