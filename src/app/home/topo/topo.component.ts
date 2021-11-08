import { Paciente } from 'src/assets/models/paciente.model';
import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from 'src/app/autenticacao.service';
import { UpdatePacienteService } from 'src/app/paciente/update-paciente.service';
import { UpdateProntuarioService } from 'src/app/prontuario/update-prontuario.service';

@Component({
  selector: 'fisio-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.scss']
})
export class TopoComponent implements OnInit {

  constructor(
    private autenticacaoService: AutenticacaoService,
    private updatePacienteService: UpdatePacienteService,
    private updateProntuarioService: UpdateProntuarioService
    ) { }

  ngOnInit(): void {
  }

  public sair () { 
    this.autenticacaoService.sair();
  }

  limparPacienteUpdate() {
    this.updatePacienteService.cleanUpdatePaciente();
  }

  limparProntuarioUpdate() {
    this.updateProntuarioService.cleanUpdateProntuario();
  }

}
