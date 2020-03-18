let popup = document.querySelector(".popup");

//let closeButton = document.querySelector(".popup .closeButton");
//closeButton.addEventListener("click", togglePopup);

window.addEventListener("click", windowOnClick);

let noBtn = document.querySelector("#noBtn");
noBtn.addEventListener("click", togglePopup);

let yesBtn = document.querySelector("#yesBtn");
yesBtn.addEventListener("click", function(){
    let http = new XMLHttpRequest();
    http.open("DELETE", "http://localhost:8080/parkHouses/delete/"+currentPh.id, true);
    http.setRequestHeader("Content-Type", "application/json");
    http.onreadystatechange = function(){
        if(this.readyState==4){
            if(this.status == 200){
            togglePopup();
            dataList.pop(currentPh);
            refreshDatas();
            }else{
                console.log(this.readyState);
                console.log(http.response);
            }
        }
}
http.send();
});


function togglePopup(){
    popup.classList.toggle("showPopup");
}

function windowOnClick(event) {
    if (event.target === popup) {
        togglePopup();
    }
}

