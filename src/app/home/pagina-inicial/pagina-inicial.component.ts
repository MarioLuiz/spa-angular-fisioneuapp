import { Component, OnInit } from '@angular/core';
import { UpdateAtendimentoService } from 'src/app/atendimento/update-atendimento.service';
import { UpdatePacienteService } from 'src/app/paciente/update-paciente.service';
import { UpdateProntuarioService } from 'src/app/prontuario/update-prontuario.service';

@Component({
  selector: 'fisio-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss']
})
export class PaginaInicialComponent implements OnInit {

  constructor(
    private updatePacienteService: UpdatePacienteService,
    private updateProntuarioService: UpdateProntuarioService,
    private updateAtendimentoService: UpdateAtendimentoService
  ) { 
    
  }

  ngOnInit(): void {
    
  }

  limparPacienteUpdate() {
    this.updatePacienteService.cleanUpdatePaciente();
  }

  limparProntuarioUpdate() {
    this.updateProntuarioService.cleanUpdateProntuario();
  }

  limparAtendimentoUpdate() {
    this.updateAtendimentoService.cleanUpdate();
  }

}
