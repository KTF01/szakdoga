export class PopUpContainer {
  popupIsOpen: boolean = false;
  popUp2IsOpen: boolean = false;
  popUp3IsOpen: boolean = false;
  popUp4IsOpen: boolean = false;
  popUp5IsOpen: boolean = false;
  openPopUp() {
    this.popupIsOpen = true;
  }

  closePopUp(): void {
    this.popupIsOpen = false;
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

  closePopUp4() {
    this.popUp4IsOpen = false;
  }
  openPopUp5() {
    this.popUp5IsOpen = true;
  }

  closePopUp5() {
    this.popUp5IsOpen = false;
  }

}
