import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AtendimentoService } from 'src/app/atendimento.service';
import { Atendimento } from 'src/assets/models/atendimento.model';
import { Paciente } from 'src/assets/models/paciente.model';
import { Pageable } from 'src/assets/models/pageable.model';
import { PageableResponse } from 'src/assets/models/pageableResponse.model';
import { Paginacao } from 'src/assets/models/paginacao.model';
import { Prontuario } from 'src/assets/models/prontuario.model';
import { Sort } from 'src/assets/models/sort.model';
import { UpdateAtendimentoService } from '../update-atendimento.service';


@Component({
  selector: 'fisio-consulta-atendimento',
  templateUrl: './consulta-atendimento.component.html',
  styleUrls: ['./consulta-atendimento.component.scss']
})
export class ConsultaAtendimentoComponent implements OnInit, AfterViewInit {

  pageableResponse: PageableResponse = new PageableResponse();
  palavraDaPesquisa: string = '';
  pageable: Pageable = new Pageable(0, 0, 8, true, new Sort(false, true, false), false);
  mensagensErroConsulta: string[] = [];
  paginacao: Paginacao = new Paginacao(0, 8, 'data', 'ASC');
  paciente: Paciente | undefined;
  atendimento: Atendimento | undefined;
  prontuarioVisualizar: any = new Prontuario('', '', '', '', '', '')
  pacienteVisualizar: Paciente = new Paciente('', '', '', '', '', '', '', false)
  atendimentoVisualizar: any

  atendimentos: any[] = [];
  p: number = 0;

  constructor(
    private updateAtendimentoService: UpdateAtendimentoService,
    private atendimentoService: AtendimentoService,
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
    this.atendimentoService.consultarAtendimentosPorNomePacientePaginado(this.paginacao, this.palavraDaPesquisa)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe(
        resposta => {
          this.pageableResponse = resposta.body
          //console.log('Atendimentos', resposta.body)
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
      this.atendimentos = this.pageableResponse.content
      console.log('Atendimentos: ', this.atendimentos)
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

  alterarAtendimento(atendimento: any) {
    //console.log('atendimento: ', atendimento)
    let dataHora: string[] = atendimento.data.split(' ');
    let data = dataHora[0];
    let hora = dataHora[1];
    this.atendimento = new Atendimento(atendimento.id, atendimento.fisioterapeuta.id, atendimento.prontuario.paciente.id, data, hora, atendimento.estadoPaciente, atendimento.relatoAtendimento);
    this.paciente = new Paciente(
      atendimento.prontuario.paciente.id,
      atendimento.fisioterapeuta.id,
      atendimento.prontuario.paciente.nome,
      atendimento.prontuario.paciente.email,
      atendimento.prontuario.paciente.telefone,
      atendimento.prontuario.paciente.cpf,
      atendimento.prontuario.paciente.dataNascimento,
      atendimento.prontuario.paciente.podeVisualizarSeuAtendimento);
    //console.log('Atendimento: ', this.atendimento)
    this.updateAtendimentoService.setUpdateAtendimento(this.atendimento);
    this.updateAtendimentoService.setUpdatePaciente(this.paciente);
    //console.log('UpdateAtendimento: ', this.updateAtendimentoService.getUpdateAtendimento());
    //console.log('UpdatePaciente: ', this.updateAtendimentoService.getUpdatePaciente());
    this.router.navigate(['fisio/cadastrar-editar-atendimento'])
  }

  public guardarAtendimentoVisualizar(atendimentoVisualizar: any) {
    this.atendimentoVisualizar = atendimentoVisualizar;
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

}
