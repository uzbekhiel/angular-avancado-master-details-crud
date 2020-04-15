import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-server-error-messages',
  template: `
    <div class="alert alert-danger mt-4" *ngIf="serverErrors">
        <strong>Erro no servidor</strong>
        <ul>
            <li *ngFor="let error of serverErrors">{{error}}</li>
        </ul>
    </div>
  `,
  styleUrls: ['./server-error-messages.component.css']
})
export class ServerErrorMessagesComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('server-errors') serverErrors: string[] = [];

  constructor() { }

  ngOnInit() {
  }

}
