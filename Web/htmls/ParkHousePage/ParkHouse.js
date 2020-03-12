let params = new URLSearchParams(location.search);
var url_string = window.location;
var url = new URL(url_string);
var id = url.searchParams.get("id");

let parkHouse;

function loadParkhouse(){
    let http = new XMLHttpRequest();
    http.open("GET", `http://localhost:8080/parkHouses/${id}`, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status == 200){
            parkHouse = JSON.parse(http.response);

            console.log(parkHouse);
            let h1 = document.querySelector('#page h1');
            let h2 = document.querySelector('#page h2');
            let h3 = document.querySelector('#page h3');
            h1.innerHTML+=parkHouse.name;
            h2.innerHTML+=parkHouse.address;
            h3.innerHTML+=parkHouse.numberOfFloors;
            let sectors = document.querySelector("#listOfSectors");
            
            for(let i = 0; i<parkHouse.sections.length; i++){
                let sectorElement = document.createElement("li");
                sectorElement.innerHTML=parkHouse.sections[i]["name"];
                sectors.appendChild(sectorElement);
            }
            
            

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


