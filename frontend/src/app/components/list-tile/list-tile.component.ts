import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { PopUpContainer } from '../common/pop-up/PopUpContainer';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/Role';

/**
 * Egyedi lista elem, Állítható törlés gomb megjelenítéssel.
 */

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
  constructor( private authService:AuthService) { super(); }

  ngOnInit(): void {
    //Ha nem admin a felhasználó semmiképp se lehet törölni.
    if(this.authService.loggedInUser && this.isDeletable==true){
      this.isDeletable = !(this.authService.loggedInUser.role==Role.ROLE_USER);
    }
  }

  deleteElementEvent(){
    this.elementDeleted.emit('');
  }

  closePopUp(){
    this.popUpIsOpen=false;
    this.errorDisplay=null;
  }
}
