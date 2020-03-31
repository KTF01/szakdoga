let parkHouseList = [
];

let currentPh = null;

let loadStartEvent = new Event("load_start");
let loadEndEvent = new Event("load_end");

function deleteParkHouse(parkHouse, callback) {
    let http = new XMLHttpRequest();
    http.open("DELETE", "http://localhost:8080/parkHouses/delete/" + parkHouse.id, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                togglePopup();
                parkHouseList.pop(parkHouse);
                callback();
            } else {
                console.log(this.readyState);
                console.log(http.response);
            }
        }
    }
    http.send();
}

function updateParkHouse(parkHouse, callback) {
    let http = new XMLHttpRequest();
    http.open("PUT", "http://localhost:8080/parkHouses/updatePH/" + parkHouse.id, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let updatedParkHouse = JSON.parse(http.response);
                callback(updatedParkHouse);
            } else {
                console.log(this.readyState);
                console.log(http.response);
            }
        }
    }
    console.log(parkHouse);
    http.send(JSON.stringify(parkHouse));
}

function saveParkHouseToDb(parkHouse, callback) {
    let http = new XMLHttpRequest();
    http.open("POST", "http://localhost:8080/parkHouses/newPH", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let newData = JSON.parse(http.response);
                parkHouseList.push(newData);
                togglePopup();
                callback(newData);
            } else {
                console.log(this.readyState);
                console.log(http.response);
            }
        }
    }
    http.send(JSON.stringify(parkHouse));
}

function addSectorsToParkHouse(parkHouse, formList, callback) {
    let http = new XMLHttpRequest();
    http.open("PUT", "http://localhost:8080/parkHouses/addSectors/" + parkHouse.id, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let modifiedParkHouse = JSON.parse(http.response);
                togglePopup();
                callback(modifiedParkHouse);
            } else {
                console.log(this.readyState);
                console.log(http.response);
            }
        }
    }

    let requestList = [];
    for (let i = 0; i < formList.length; i++) {
        let newSector = {
            name: formList[i].name.value,
            floor: formList[i].floor.value
        }
        requestList.push(newSector);
    }
    http.send(JSON.stringify(requestList));
}

function deleteSector(sector, callback) {
    let http = new XMLHttpRequest();
    http.open("DELETE", "http://localhost:8080/sectors/delete/" + sector.id, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                //let responseSectors =JSON.parse(http.response);
                togglePopup();
                callback();
            } else {
                console.log(this.readyState);
                console.log(http.response);
            }
        }
    }
    http.send();
}