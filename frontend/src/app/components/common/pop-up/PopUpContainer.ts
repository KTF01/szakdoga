/**
 * Segéd osztály ami hat különböző popup kezelését teszi lehetővé egy komponensen
 * az ebből, származtatott osztályok számára.
 */
export class PopUpContainer {
  popUpIsOpen: boolean = false;
  popUp2IsOpen: boolean = false;
  popUp3IsOpen: boolean = false;
  popUp4IsOpen: boolean = false;
  popUp5IsOpen: boolean = false;
  popUp6IsOpen: boolean = false;

  openPopUp() {
    this.popUpIsOpen = true;
  }

  closePopUp(): void {
    this.popUpIsOpen = false;
  }

  openPopUp2() {
    this.popUp2IsOpen = true;
  }

  closePopUp2() {
    this.popUp2IsOpen = false;
  }
  openPopUp3() {
    this.popUp3IsOpen = true;
  }

  closePopUp3() {
    this.popUp3IsOpen = false;
  }
  openPopUp4() {
    this.popUp4IsOpen = true;
  }
  openPopUp6() {
    this.popUp6IsOpen = true;
  }

  closePopUp4() {
    this.popUp4IsOpen = false;
  }
  openPopUp5() {
    this.popUp5IsOpen = true;
  }

  closePopUp5() {
    this.popUp5IsOpen = false;
  }
  closePopUp6() {
    this.popUp6IsOpen = false;
  }

}
