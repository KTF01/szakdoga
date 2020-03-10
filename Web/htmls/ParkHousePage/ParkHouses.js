let http = new XMLHttpRequest();
let myUl = document.querySelector('#listOfDatas');
let myButton = document.querySelector("#sendButton");
let addbtn = document.querySelector(".addbtn");

let sendbtn = document.querySelector("#sendbtn");

let addFrom = document.forms.NewDataForm;
let addFormData = new FormData(addFrom);

let dataList = [
    {
        name : "Loszar",
        address:"1202 cfasz",
        numberOfFloors : "3"
    }
];

for(let i = 0; i<dataList.length; i++){
    addParkHouse(dataList[i].name,dataList[i].address, dataList[i].numberOfFloors);
}

addbtn.addEventListener('click', function(){
    console.log("fds");
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

        dataList.push(newData);
        addParkHouse(newData.name, newData.address, newData.numberOfFloors);
        formElements[0].value="";
        formElements[1].value="";
        formElements[2].value="";
        addFrom.classList.toggle("show");
        addbtn.classList.toggle("hide");
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

function addParkHouse(name, address, numberOfFloors){
    myUl.innerHTML+=`<div class='dataCard'><span class='name'>${name}</span>`+
    `<span class="adress">${address}</span>`
    +`<span class='numberOfFloors'>${numberOfFloors}</span></div>`;
}


/*http.onreadystatechange = function(){
    if(this.readyState==4 && this.status == 200){
        myUl.innerHTML+="<li>"+JSON.parse(http.response)[0]["name"]+"</li>";
    }
}

myButton.addEventListener("click", function(){
    http.open("GET", "http://localhost:8080/parkHouses/all");
    http.send();
});*/