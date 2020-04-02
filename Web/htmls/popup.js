let popup = document.createElement("div");
popup.className="popup";
popup.isClosable=true;
let popupContent = document.createElement("div");
popupContent.className="popupContent";
popupContent.addEventListener("load_start", function(){
    popup.isClosable=false;
    this.oldHtml = this.innerHTML;
    this.innerHTML="<div class='lds-ring'><div></div><div></div><div></div><div></div></div>";
});

popupContent.addEventListener("load_end", function(){
    popup.isClosable = true;
});

popup.appendChild(popupContent);
document.body.appendChild(popup);

function togglePopup(){
    popup.classList.toggle("showPopup");
}

window.addEventListener("click", function(event){
    if (event.target === popup && popup.isClosable===true) {
        togglePopup();
    }
});

function createYesNoButtons(yesText, noText, yesFunc, noFunc){
    let popupButtons = document.createElement("div");
    popupButtons.id="answerBtns";
    let yesBtn = document.createElement("span");
    yesBtn.id="yesBtn";
    yesBtn.innerHTML=yesText;
    yesBtn.addEventListener("click", yesFunc);
    let noBtn = document.createElement("span");
    noBtn.id="noBtn";
    noBtn.innerHTML=noText;
    noBtn.addEventListener("click", noFunc);
    popupButtons.appendChild(yesBtn);
    popupButtons.appendChild(noBtn);

    return popupButtons;
}

//TODO createPopup
function createPopup(popupText,yesFunc){
    popupContent.innerHTML="";
    let text = document.createElement("h1");
    text.innerHTML=popupText;
    
    let answerButtons = createYesNoButtons("Igen", "Nem", yesFunc, togglePopup);

    popupContent.appendChild(text);
    popupContent.appendChild(answerButtons);
}


let nameInput = document.createElement("input");
    nameInput.placeholder = "Név";
let addressInput = document.createElement("input");
    addressInput.placeholder = "Cím";
let numberInput = document.createElement("input");
    numberInput.placeholder = "Szintek száma";
    numberInput.type="number";

let editForm = {
    name : nameInput,
    address : addressInput,
    number : numberInput
}


function createEditPopup({name, address, numberOfFloors}, yesFunc){
    popupContent.innerHTML="";

    let form = document.createElement("div");
    form.className="popupForm";

    editForm.name.value=name;
    editForm.address.value=address;
    editForm.number.value=numberOfFloors;


    form.appendChild(nameInput);
    form.appendChild(addressInput);
    form.appendChild(numberInput);

    let answerButtons=createYesNoButtons("Mentés", "Mégse", yesFunc, togglePopup);

    popupContent.appendChild(form);
    popupContent.appendChild(answerButtons);
}


let formList = [
]

function createAddSectorForm(){
    let formListElement = document.createElement("div");
    let sectorNameInput = document.createElement("input");
    sectorNameInput.placeholder="Név";
    let sectorFloorInput = document.createElement("input");
    sectorFloorInput.placeholder = "Szint";
    sectorFloorInput.type="number";
    sectorFloorInput.min="0";
    sectorFloorInput.max=currentPh.numberOfFloors;
    formList.push({name : sectorNameInput, floor : sectorFloorInput});

    formListElement.appendChild(sectorNameInput);
    formListElement.appendChild(sectorFloorInput);
    return formListElement;
}
function createAddParkingLotsFormItem(){
    let formListElement = document.createElement("div");
    let parkingLotNameInput = document.createElement("input");
    parkingLotNameInput.placeholder="Név";
    formList.push({name : parkingLotNameInput});
    formListElement.appendChild(parkingLotNameInput);
    return formListElement;
}

function showAddFormPopup(formItemFunc, yesFunc){
    popupContent.innerHTML="";

    formList=[];

    let formListDiv = document.createElement("div");
    formListDiv.className="popupFormList";

    let formUl=document.createElement("ul");
    formUl.className="formUl";

    //TODO GATYÁBA RÁZÁS
    let formListElement = formItemFunc();
    formUl.appendChild(formListElement);

    let smallBtnDiv = document.createElement("div");
    smallBtnDiv.className="smallBtnContainer";
    let plusBtn = document.createElement("span");
    plusBtn.id="popupSmallBtn";
    plusBtn.innerHTML="<i class='fas fa-plus'></i>";
    plusBtn.addEventListener("click", function(){
        let newFormListElement = formItemFunc();
        formUl.appendChild(newFormListElement);
        console.log(formList);
    });

    let minusBtn = document.createElement("span");
    minusBtn.id="popupSmallBtn";
    minusBtn.innerHTML="<i class='fas fa-minus'></i>";
    minusBtn.addEventListener("click", function(){
        if(formList.length>0){
            formList.pop();
            formUl.removeChild(formUl.childNodes[formUl.childNodes.length-1]);
        }
    });

    formListDiv.appendChild(formUl);
    smallBtnDiv.appendChild(plusBtn);
    smallBtnDiv.appendChild(minusBtn);
    formListDiv.appendChild(smallBtnDiv);

    let answerButtons=createYesNoButtons("Mentés", "Mégse", yesFunc, togglePopup);

    popupContent.appendChild(formListDiv);
    popupContent.appendChild(answerButtons);
}