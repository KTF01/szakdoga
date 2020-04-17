import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { PopUpContainer } from '../pop-up/PopUpContainer';

@Component({
  selector: 'app-list-tile',
  templateUrl: './list-tile.component.html',
  styleUrls: ['./list-tile.component.css']
})
export class ListTileComponent extends PopUpContainer implements OnInit {

  @Output() elementDeleted = new EventEmitter<string>();

  errorDisplay:string=null;

  trashIcon = faTrash;

  @Input() isDeletable:boolean=true;
  constructor() { super(); }

  ngOnInit(): void {
  }

  deleteElementEvent(){
    this.elementDeleted.emit('');

  }

  closePopUp(){
    this.popupIsOpen=false;
    this.errorDisplay=null;
  }
}
