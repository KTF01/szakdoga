let http = new XMLHttpRequest();
let myUl = document.querySelector('ul');
let myButton = document.querySelector("#sendButton");







http.onreadystatechange = function(){
    if(this.readyState==4 && this.status == 200){
        myUl.innerHTML+="<li>"+JSON.parse(http.response)[0]["name"]+"</li>";
    }
}

myButton.addEventListener("click", function(){
    http.open("GET", "http://localhost:8080/parkHouses/all");
    http.send();
});