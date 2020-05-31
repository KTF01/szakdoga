import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonData } from '../../../common-data';
import { CommonService } from '../../../services/common.service';


/**
 * Felugró ablak. 
 */
@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {

  @Input() isOpen: boolean = false;

  @Input() alertPopup: boolean = false;

  @Input() actionButtons: boolean = true;

  @Input() nobackGround: boolean = false;

  @Output() closeEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() okEvent: EventEmitter<void> = new EventEmitter<void>();

  @Input() okText: string = "Ok"

  constructor(public commonSevice:CommonService) { }

  ngOnInit(): void {

  }

  onClose() {
    this.closeEvent.emit();
  }
  onOk() {
    this.okEvent.emit();
  }
}
