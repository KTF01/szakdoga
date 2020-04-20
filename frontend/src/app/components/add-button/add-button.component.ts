import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/Role';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.css']
})
export class AddButtonComponent implements OnInit {

  @Output() addEvent:EventEmitter<string> = new EventEmitter<string>();

  isAdmin:boolean;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    if(this.authService.loggedInUser){
      this.isAdmin = this.authService.loggedInUser.role==Role.ROLE_ADMIN || this.authService.loggedInUser.role==Role.ROLE_FIRST_USER;
    }
  }

  addElement(){
    this.addEvent.emit('');
  }
}
