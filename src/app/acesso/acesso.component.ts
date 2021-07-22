import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../autenticacao.service';

@Component({
  selector: 'fisio-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.scss']
})
export class AcessoComponent implements OnInit {

  constructor(
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.autenticacaoService.autenticado()) {
      this.router.navigate(['/fisio'])
    }
  }

  public painelExibido: string = 'login'

  public exibirPainel(event: any): void {
    //this.login = event === 'login' ? true : false
    this.painelExibido = event
  }

}
