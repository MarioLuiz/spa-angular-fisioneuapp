import { Paciente } from 'src/assets/models/paciente.model';
import { Component, OnInit } from '@angular/core';
import { AutenticacaoService } from 'src/app/autenticacao.service';
import { UpdatePacienteService } from 'src/app/paciente/update-paciente.service';

@Component({
  selector: 'fisio-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.scss']
})
export class TopoComponent implements OnInit {

  constructor(
    private autenticacaoService: AutenticacaoService,
    private updatePacienteService: UpdatePacienteService
    ) { }

  ngOnInit(): void {
  }

  public sair () { 
    this.autenticacaoService.sair();
  }

  limparPacienteUpdate() {
    this.updatePacienteService.cleanUpdatePaciente();
  }

}
