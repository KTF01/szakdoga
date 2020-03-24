let popup = document.createElement("div");
popup.className="popup";
let popupContent = document.createElement("div");
popupContent.className="popupContent";
let popupButtons = document.createElement("div");
popupButtons.id="answerBtns";

popup.appendChild(popupContent);
document.body.appendChild(popup);

function togglePopup(){
    popup.classList.toggle("showPopup");
}

window.addEventListener("click", function(event){
    if (event.target === popup) {
        togglePopup();
    }
});

//TODO createPopup
function createPopup(popupText,yesFunc){
    popupButtons.innerHTML="";
    popupContent.innerHTML="";
    let text = document.createElement("h1");
    text.innerHTML=popupText;
    let yesBtn = document.createElement("span");
    yesBtn.id="yesBtn";
    yesBtn.innerHTML="Igen";
    yesBtn.addEventListener("click", yesFunc);
    let noBtn = document.createElement("span");
    noBtn.id="noBtn";
    noBtn.innerHTML="Nem";
    noBtn.addEventListener("click", togglePopup);

    popupButtons.appendChild(yesBtn);
    popupButtons.appendChild(noBtn);
    popupContent.appendChild(text);
    popupContent.appendChild(popupButtons);
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
    popupButtons.innerHTML="";
    popupContent.innerHTML="";

    let form = document.createElement("div");
    form.className="popupForm";

    editForm.name.value=name;
    editForm.address.value=address;
    editForm.number.value=numberOfFloors;


    form.appendChild(nameInput);
    form.appendChild(addressInput);
    form.appendChild(numberInput);

    let saveBtn = document.createElement("span");
    saveBtn.id="yesBtn";
    saveBtn.innerHTML="Mentés";
    saveBtn.addEventListener("click", yesFunc);
    let discardBtn = document.createElement("span");
    discardBtn.id="noBtn";
    discardBtn.innerHTML="Mégse";
    discardBtn.addEventListener("click", togglePopup);
    popupButtons.appendChild(saveBtn);
    popupButtons.appendChild(discardBtn);

    popupContent.appendChild(form);
    popupContent.appendChild(popupButtons);
}


let formList = [
    {
        name : nameInput,
        number : numberInput
    }
]


function showAddSectorPopup(){
    popupButtons.innerHTML="";
    popupContent.innerHTML="";
    formList=[];

    let formListDiv = document.createElement("div");
    formListDiv.className="popupFormList";

    let formUl=document.createElement("ul");
    formUl.className="formUl";

    //TODO GATYÁBA RÁZÁS
    let formListElement = document.createElement("div");
    let sectorNameInput = document.createElement("input");
    sectorNameInput.placeholder="Név";
    let sectorFloorInput = document.createElement("input");
    sectorFloorInput.placeholder = "Szint";
    sectorFloorInput.type="number";
    formList.push({sectorNameInput,sectorFloorInput});

    formListElement.appendChild(sectorNameInput);
    formListElement.appendChild(sectorFloorInput);
    formUl.appendChild(formListElement);

    let smallBtnDiv = document.createElement("div");
    smallBtnDiv.className="smallBtnContainer";
    let plusBtn = document.createElement("span");
    plusBtn.id="popupSmallBtn";
    plusBtn.innerHTML="<i class='fas fa-plus'></i>";
    plusBtn.addEventListener("click", function(){
        let newFormListElement = document.createElement("div");
        let newSectorNameInput = document.createElement("input");
        newSectorNameInput.placeholder="Név";
        let newSectorFloorInput = document.createElement("input");
        newSectorFloorInput.placeholder = "Szint";
        newSectorFloorInput.type="number";
        formList.push({newSectorNameInput,newSectorFloorInput});
        newFormListElement.appendChild(newSectorNameInput);
        newFormListElement.appendChild(newSectorFloorInput);
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

    let saveBtn = document.createElement("span");
    saveBtn.id="yesBtn";
    saveBtn.innerHTML="Mentés";
    //saveBtn.addEventListener("click", yesFunc);
    let discardBtn = document.createElement("span");
    discardBtn.id="noBtn";
    discardBtn.innerHTML="Mégse";
    discardBtn.addEventListener("click", togglePopup);
    popupButtons.appendChild(saveBtn);
    popupButtons.appendChild(discardBtn);

    popupContent.appendChild(formListDiv);
    popupContent.appendChild(popupButtons);
}



