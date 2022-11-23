import { Component, Input, OnInit} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() title!: string;
  @Input() msg!: string;
  @Input() cancelTxt: string = "Cancelar";
  @Input() okTxt: string = "Ok";

  confirmResult!: Subject<boolean>;

  constructor(public bsModalRef: BsModalRef){}

  ngOnInit(): void {
    this.confirmResult = new Subject();
  }

  onConfirm(){
    this.confirmAndClose(true);
  }

  onClose(){
    this.confirmAndClose(false);
  }

  private confirmAndClose(value: boolean){
    this.confirmResult.next(value);
    this.bsModalRef.hide();
  }

}
