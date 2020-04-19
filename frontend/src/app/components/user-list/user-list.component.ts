import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { CommonService } from '../../services/common.service';
import { faUser, faUserEdit, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/User';
import { Role } from '../../models/Role';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userIcon =faUser;

  FIRST_USER_ROLE: Role = Role.ROLE_FIRST_USER;
  USER_ROLE: Role = Role.ROLE_USER;

  constructor(private authService:AuthService,public userService:UserServiceService, public commonService:CommonService) { }

  ngOnInit(): void {
    this.userService.loadUsers();
  }

  getUserIcon(user:User){
    switch (user.role){
        case Role.ROLE_USER: this.userIcon =faUser; break;
        case Role.ROLE_ADMIN: this.userIcon=faUserEdit; break;
        case Role.ROLE_FIRST_USER: this.userIcon=faUserCog; break;
      }
      return this.userIcon;
  }

  adminBtnPressed(user:User){
    if(user.role==Role.ROLE_USER){
      console.log(user.firstName +' Admin lett!');
      user.role=Role.ROLE_ADMIN;
    }else if(user.role==Role.ROLE_ADMIN){
      console.log(user.firstName +' elvesztette adminságát!');
      user.role=Role.ROLE_USER;
    }else{
      console.log(user.firstName +' az első User, nem módosítható!');
    }
  }

}
