let params = new URLSearchParams(location.search);
let url_string = window.location;
let url = new URL(url_string);
let id = url.searchParams.get("id");
let sectorList = document.querySelector("#listOfSectors");
let parkHouse;

let nameElement = document.querySelector("#info h1");
let addressElement = document.querySelector("#info h2");
let levelElement = document.querySelector("#info h3");
function loadParkhouse() {
    let http = new XMLHttpRequest();
    http.open("GET", `http://localhost:8080/parkHouses/${id}`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                parkHouse = JSON.parse(http.response);

                nameElement.innerHTML += parkHouse.name;
                addressElement.innerHTML += parkHouse.address;
                levelElement.innerHTML += parkHouse.numberOfFloors;

                updateSectors(parkHouse.sections);

                currentPh = parkHouse;

                //TODO SECTIONS ORE SECTORS!!! DECIDE
            } else {
                console.log(this.readyState);
                console.log(http.response);
            }
        }
    }
    http.send();
}
loadParkhouse();

function createSectorElement(sector){
    let sectorElement = document.createElement("div");
    sectorElement.className="sectorItem";
    let deleteButton = document.createElement("div");
    deleteButton.className="trash";
    deleteButton.addEventListener("click", function(){
        createPopup("Biztos törlöd a szektort?", function(){
            deleteSector(sector, function(){
                let index = parkHouse.sections.indexOf(sector);
                if (index > -1) {
                    parkHouse.sections.splice(index, 1);
                  }
                updateSectors(parkHouse.sections);
            });
        });
        togglePopup();
    });

    deleteButton.innerHTML="<i class='far fa-trash-alt'></i>";
    sectorElement.innerHTML=`<div class="sectorInfo"><span>${sector.name}</span>`+
                            `<span>${sector.floor}</span>`+
                            `<i class="fas fa-caret-down"></i></div>`;
    sectorElement.appendChild(deleteButton);

    return sectorElement;
}

function updateSectors(sectors) {
    sectorList.innerHTML = "";
    for (let i = 0; i < sectors.length; i++) {
        let sectorElement = createSectorElement(sectors[i]);
        sectorList.appendChild(sectorElement);
    }
}

let deleteButton = document.querySelector(".trash");
deleteButton.addEventListener("click", function () {
    createPopup("Biztos törlöd?", function () { deleteParkHouse(parkHouse, function () { window.location = "../ParkHousesPage/ParkHouses.html"; }); });
    togglePopup();
});


let editButton = document.querySelector(".edit");
let buttons = document.querySelector("#buttons");
editButton.addEventListener("click", function () {
    createEditPopup(parkHouse, function () {
        parkHouse.name = editForm.name.value;
        parkHouse.address = editForm.address.value;
        parkHouse.numberOfFloors = editForm.number.value;
        updateParkHouse(parkHouse, function () {
            location.reload();
        });
    });
    togglePopup();
});


let addbtn = document.querySelector(".addbtn");

addbtn.addEventListener('click', function () {
    showAddSectorPopup(function () {
        console.log("fds");
        addSectorsToParkHouse(parkHouse, formList, function (modifiedParkHouse) {
            updateSectors(modifiedParkHouse.sections);
            parkHouse=modifiedParkHouse;
        })
    });
    togglePopup();
});