import { AutenticacaoService } from 'src/app/autenticacao.service';
import { Component, OnInit } from '@angular/core';
import { PacienteConsultaAtendimentoService } from './paciente-consulta-atendimento.service';

@Component({
  selector: 'fisio-paciente-consulta-atendimento',
  templateUrl: './paciente-consulta-atendimento.component.html',
  styleUrls: ['./paciente-consulta-atendimento.component.scss']
})
export class PacienteConsultaAtendimentoComponent implements OnInit {

  constructor(
    private autenticacaoService: AutenticacaoService,
    private pacienteConsultaAtendimentoService: PacienteConsultaAtendimentoService,
  ) { }

  ngOnInit(): void {
    console.log('pacienteConsultaAtendimentoService: ', this.pacienteConsultaAtendimentoService.getPacienteConsultaAtendimento())
  }

  public sair() {
    this.autenticacaoService.sair();
  }

}
