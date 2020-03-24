
let myUl = document.querySelector('#listOfDatas');
let addbtn = document.querySelector(".addbtn");

let sendbtn = document.querySelector("#sendbtn");

function loadParkHouses(){
    let http = new XMLHttpRequest();
    http.open("GET", "http://localhost:8080/parkHouses/all", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status == 200){
                parkHouseList = (JSON.parse(http.response));
                refreshDatas();
            }else{
                console.log(this.readyState, this.status);
                console.log(http.response);
            }
        }
}
http.send();
}

loadParkHouses();


addbtn.addEventListener('click', function(){
    createEditPopup({name: "", address:"", numberOfFloors:""}, handleParkHouseForm);
    togglePopup();
});

function handleParkHouseForm(){

    let newData = {
        name : editForm.name.value,
        address: editForm.address.value,
        numberOfFloors : editForm.number.value,
    }

    if(validateNewParkHouseForm(newData)){
        saveParkHouseToDb(newData, addParkHouse);
    }else{
        console.log("INVALID");//TODO!!!
    }
}


function validateNewParkHouseForm(data){
    if(data.name.length === 0 || !data.name.trim()) return false;
    if(data.address.length === 0 || !data.address.trim()) return false;
    if(!(/^-{0,1}\d+$/.test(data.numberOfFloors))) return false;
    return true;
}

function addParkHouse(parkHouse){
    let listItem = document.createElement('li');
    listItem.className="listItem";
    let card = document.createElement('div');
    card.className="dataCard";
    card.innerHTML=`<span class='name'>${parkHouse.name}</span>`+
    `<span class="adress">${parkHouse.address}</span>`
    +`<span class='numberOfFloors'>${parkHouse.numberOfFloors}</span>`;
    card.addEventListener("click", function(){
        currentPh=parkHouse;
        window.location=`../ParkHousePage/ParkHouse.html?id=${parkHouse.id}`;

    });
    listItem.appendChild(card);
    let deleteIcon = document.createElement("div");
    deleteIcon.innerHTML="<i class='far fa-trash-alt '></i>";
    deleteIcon.className=`trash`;

    deleteIcon.addEventListener("click", function(){
        currentPh = parkHouse;
        createPopup("Biztos törölni akarod a parkolóházat?", function(){deleteParkHouse(currentPh, refreshDatas)});
        togglePopup();
    })

    listItem.appendChild(deleteIcon);
    myUl.appendChild(listItem);

}

function refreshDatas(){
    myUl.innerHTML="";
    for(let i = 0; i<parkHouseList.length; i++){
        addParkHouse(parkHouseList[i]);
    }
}

