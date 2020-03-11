
let myUl = document.querySelector('#listOfDatas');
let addbtn = document.querySelector(".addbtn");

let sendbtn = document.querySelector("#sendbtn");

let addFrom = document.forms.NewDataForm;

let dataList = [
];


function loadParkHouses(){
    let http = new XMLHttpRequest();
    http.open("GET", "http://localhost:8080/parkHouses/all", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status == 200){
            dataList = (JSON.parse(http.response));
            for(let i = 0; i<dataList.length; i++){
                addParkHouse(dataList[i]);
            }
            }else{
                console.log(this.readyState);
                console.log(http.response);
            }
        }
}
http.send();
}

loadParkHouses();



addbtn.addEventListener('click', function(){
    addFrom.classList.toggle("show");
    addbtn.classList.toggle("hide");
});

sendbtn.addEventListener('click', function(event){
    event.preventDefault();
    let formElements = document.querySelectorAll("#NewDataForm input");

    formElements[2].value;
    let newData = {
        name : formElements[0].value,
        address: formElements[1].value,
        numberOfFloors : formElements[2].value,
    }

    if(validateNewParkHouseForm(newData)){
        saveParkHouseToDb(newData);
        formElements[0].value="";
        formElements[1].value="";
        formElements[2].value="";
    }else{
        console.log("INVALID");//TODO!!!
    }

});

function validateNewParkHouseForm(data){
    if(data.name.length === 0 || !data.name.trim()) return false;
    if(data.address.length === 0 || !data.address.trim()) return false;
    if(!(/^-{0,1}\d+$/.test(data.numberOfFloors))) return false;
    return true;
}

function addParkHouse(data){
    let card = document.createElement('div');
    card.className="dataCard";
    card.innerHTML=`<span class='name'>${data.name}</span>`+
    `<span class="adress">${data.address}</span>`
    +`<span class='numberOfFloors'>${data.numberOfFloors}</span>`;
    card.addEventListener("click", function(){
        window.location=`../SectorPage/sector.html?id=${data.id}`;
    });
    myUl.appendChild(card);
}



//HTTP REQUESTS


function saveParkHouseToDb(parkHouse){
    let http = new XMLHttpRequest();
    http.open("POST", "http://localhost:8080/parkHouses/newPH", true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status == 200){
            let newData = JSON.parse(http.response);
            dataList.push(newData);
        addParkHouse(newData.name, newData.address, newData.numberOfFloors);
        
        addFrom.classList.toggle("show");
        addbtn.classList.toggle("hide");
            
            }else{
                console.log(this.readyState);
                console.log(http.response);
            }
        }
}
http.send(JSON.stringify(parkHouse));
}
