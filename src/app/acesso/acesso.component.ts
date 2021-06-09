import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fisio-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.scss']
})
export class AcessoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public login: boolean = true

  public exibirPainel(event: string): void {
    this.login = event === 'login' ? true : false
  }

}
