let params = new URLSearchParams(location.search);
let url_string = window.location;
let url = new URL(url_string);
let id = url.searchParams.get("id");
let sectorList = document.querySelector("#listOfSectors");
let parkHouse;

let contentElement = document.querySelector("#content");
let infoElement = document.querySelector("#info");
function loadParkhouse() {
    let http = new XMLHttpRequest();
    http.open("GET", `http://localhost:8080/parkHouses/${id}`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                parkHouse = JSON.parse(http.response);
                refreshInfo(parkHouse);
                updateSectors(parkHouse.sectors);

                currentPh = parkHouse;

            } else {
                console.log(this.readyState);
                console.log(http.response);
            }
        }
    }
    http.send();
}
loadParkhouse();

function refreshInfo(parkH){
    infoElement.innerHTML = `<h2>${parkH.name}</h2>`+
    `<h2>${parkH.address}</h2>`+
    `<h2>${parkH.numberOfFloors}</h2>`;

}

function createSectorElement(sector) {
    let sectorElement = document.createElement("div");
    sectorElement.className = "sectorItem";
    let deleteButton = document.createElement("div");
    deleteButton.className = "trash";
    deleteButton.addEventListener("click", function () {
        createPopup("Biztos törlöd a szektort?", function () {
            popupContent.dispatchEvent(loadStartEvent);
            deleteSector(sector, function () {
                let index = parkHouse.sectors.indexOf(sector);
                if (index > -1) {
                    parkHouse.sectors.splice(index, 1);
                }
                updateSectors(parkHouse.sectors);
            });
        });
        togglePopup();
    });

    deleteButton.innerHTML = "<i class='far fa-trash-alt'></i>";
    let sectorInfoElement = document.createElement("div");
    sectorInfoElement.className="sectorInfo";
    let sectorHeader = document.createElement("div");
    sectorHeader.className="sectorHeader";
    let expandBtn = document.createElement("div");
    expandBtn.className="expandBtn";
    expandBtn.innerHTML=`<i class="fas fa-caret-down"></i>`;

    let parkingLotsPanel = createParkingLotPanel(sector);

    
    expandBtn.addEventListener("click", function(){
        parkingLotsPanel.classList.toggle("expanded");
        deleteButton.classList.toggle("hiddenTrash");
        deleteButton.classList.toggle("trash");
        this.classList.toggle("activeExpandBtn");
        //sectorElement.removeChild(deleteButton);
    });
    
    sectorElement.appendChild(deleteButton);
    sectorElement.appendChild(sectorInfoElement);
    sectorInfoElement.appendChild(sectorHeader);
    sectorHeader.innerHTML =    `<span>${sector.name}</span>` +
                                `<span>${sector.floor}</span>`;
    sectorHeader.appendChild(expandBtn);
    sectorInfoElement.appendChild(parkingLotsPanel);
    

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
    createPopup("Biztos törlöd?", function () {
        popupContent.dispatchEvent(loadStartEvent);
        deleteParkHouse(parkHouse, function () {
        window.location = "../ParkHousesPage/ParkHouses.html";
        });
    });
    togglePopup();
});

let editButton = document.querySelector(".edit");
let buttons = document.querySelector("#buttons");
editButton.addEventListener("click", function () {
    createEditPopup(parkHouse, function () {
        popupContent.dispatchEvent(loadStartEvent);
        parkHouse.name = editForm.name.value;
        parkHouse.address = editForm.address.value;
        parkHouse.numberOfFloors = editForm.number.value;
        updateParkHouse(parkHouse, function (updatedParkhouse) {
            popupContent.dispatchEvent(loadEndEvent);
            togglePopup();
            parkHouse = updatedParkhouse;
            refreshInfo(parkHouse);
        });
    });
    togglePopup();
});

let addbtn = document.querySelector(".addbtn");

addbtn.addEventListener('click', function () {
    showAddFormPopup(createAddSectorForm, function () {
        popupContent.dispatchEvent(loadStartEvent);
        addSectorsToParkHouse(parkHouse, formList, function (modifiedParkHouse) {
            updateSectors(modifiedParkHouse.sectors);
            parkHouse = modifiedParkHouse;
        })
    });
    togglePopup();
});