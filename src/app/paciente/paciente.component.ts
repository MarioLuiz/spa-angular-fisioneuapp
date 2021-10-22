import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fisio-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {

  componenteExibido: string = ''

  constructor() { }

  ngOnInit(): void {
  }

  exibirPainel(evento: any){

  }

}
