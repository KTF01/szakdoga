let params = new URLSearchParams(location.search);
let url_string = window.location;
let url = new URL(url_string);
let id = url.searchParams.get("id");

let parkHouse;

let nameElement = document.querySelector("#info h1");
let addressElement = document.querySelector("#info h2");
let levelElement = document.querySelector("#info h3");
function loadParkhouse(){
    let http = new XMLHttpRequest();
    http.open("GET", `http://localhost:8080/parkHouses/${id}`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status == 200){
            parkHouse = JSON.parse(http.response);

            nameElement.innerHTML+=parkHouse.name;
            addressElement.innerHTML+=parkHouse.address;
            levelElement.innerHTML+=parkHouse.numberOfFloors;
            let sectors = document.querySelector("#listOfSectors");
            
            for(let i = 0; i<parkHouse.sections.length; i++){
                let sectorElement = document.createElement("li");
                sectorElement.innerHTML=parkHouse.sections[i]["name"] +" "+ parkHouse.sections[i]["floor"];
                sectors.appendChild(sectorElement);
            }
            
            currentPh = parkHouse;

            //TODO SECTIONS ORE SECTORS!!! DECIDE
            }else{
                console.log(this.readyState);
                console.log(http.response);
            }
        }
}
http.send();
}
loadParkhouse();

createPopup("Biztos törlöd?", function(){deleteParkHouse(parkHouse, function(){window.location="../ParkHousesPage/ParkHouses.html";});});

let deleteButton = document.querySelector(".trash");
deleteButton.addEventListener("click", function(){
    createPopup("Biztos törlöd?", function(){deleteParkHouse(parkHouse, function(){window.location="../ParkHousesPage/ParkHouses.html";});});
    togglePopup();
});


let editButton = document.querySelector(".edit");
let buttons = document.querySelector("#buttons");
editButton.addEventListener("click", function(){
    createEditPopup(parkHouse,function(){
        parkHouse.name=editForm.name.value;
        parkHouse.address=editForm.address.value;
        parkHouse.numberOfFloors=editForm.number.value;
        updateParkHouse(parkHouse, function(){
            location.reload();
        });
    });
    togglePopup();
});


let addbtn = document.querySelector(".addbtn");

addbtn.addEventListener('click', function(){
    showAddSectorPopup();
    togglePopup();
});