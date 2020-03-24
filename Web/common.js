let parkHouseList = [
];

let currentPh = null;



function deleteParkHouse(parkHouse, callback){
    let http = new XMLHttpRequest();
    http.open("DELETE", "http://localhost:8080/parkHouses/delete/"+parkHouse.id, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status == 200){
            togglePopup();
            parkHouseList.pop(parkHouse);
            callback();
            }else{
                console.log(this.readyState);
                console.log(http.response);
            }
        }
}
http.send();
}

function updateParkHouse(parkHouse, callback){
    let http = new XMLHttpRequest();
    http.open("PUT", "http://localhost:8080/parkHouses/updatePH/"+parkHouse.id, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status == 200){
            togglePopup();
            callback();
            }else{
                console.log(this.readyState);
                console.log(http.response);
            }
        }
    }
    http.send(JSON.stringify(parkHouse));
}

function saveParkHouseToDb(parkHouse, callback){
    let http = new XMLHttpRequest();
    http.open("POST", "http://localhost:8080/parkHouses/newPH", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status == 200){
            let newData = JSON.parse(http.response);
            parkHouseList.push(newData);
            togglePopup();
            callback(newData);
            }else{
                console.log(this.readyState);
                console.log(http.response);
            }
        }
}
http.send(JSON.stringify(parkHouse));
}