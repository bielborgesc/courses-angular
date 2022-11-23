import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-msg-validation-error',
  templateUrl: './msg-validation-error.component.html',
  styleUrls: ['./msg-validation-error.component.css']
})
export class MsgValidationErrorComponent implements OnInit {

  @Input() msgError!: string;
  @Input() showError!: boolean;

  constructor() { }

  ngOnInit() {}

}
