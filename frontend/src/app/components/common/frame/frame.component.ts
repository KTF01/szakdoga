import { Component, OnInit, ViewEncapsulation } from '@angular/core';

/**
 * A felület vázát megvalósító komponenet.
 * Összeköti a navigációs menüt és akontentet a jobb oldalon.
 */
@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css'],encapsulation: ViewEncapsulation.None
  //Nyivánossá tesszük a css-t mert a header-nav komponens stílusait is tartalmazza.
})
export class FrameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
