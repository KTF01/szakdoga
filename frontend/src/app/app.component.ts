import { Component } from '@angular/core';
import { CommonData } from './common-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = CommonData.title;
}
