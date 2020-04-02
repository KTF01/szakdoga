function createParkingLotTile(parkingLot){
    let plTile = document.createElement("div");
    plTile.className="parkingLotTile";
    let parkingLotNameElement = document.createElement("h2");
    parkingLotNameElement.className="plName";
    parkingLotNameElement.innerHTML=parkingLot.name;
    let parkingLotIcon = document.createElement("div");
    parkingLotIcon.className="plIcon";
    parkingLotIcon.innerHTML= parkingLot.occupiingCar==undefined?"":"<i class='fas fa-car'></i>";
    plTile.appendChild(parkingLotNameElement);
    plTile.appendChild(parkingLotIcon);
    return plTile;
}



function createParkingLotPanel(sector){
    let parkingLotsPanel = document.createElement("div");
    parkingLotsPanel.className="parkignLotsPanel";
    let addParkingLotBtn = document.createElement("div");
    addParkingLotBtn.className="addParkingLotBtn";
    addParkingLotBtn.innerHTML="<div><i class='far fa-plus-square addbtn'></i></div>";
    addParkingLotBtn.addEventListener("click", function(){
        console.log("PLUS");
        showAddFormPopup(createAddParkingLotsFormItem, function(){
            popupContent.dispatchEvent(loadStartEvent);
            addParkingLotsToSector(sector, formList, function(modifiedSector){
                sector = modifiedSector;
                parkingLotsPanel.innerHTML="";
                parkingLotListElem = createParkingLotlist(sector, addParkingLotBtn);
                parkingLotsPanel.appendChild(parkingLotListElem);
            });
        });
        togglePopup();
    });
    let parkingLotListElem = createParkingLotlist(sector, addParkingLotBtn);
    parkingLotListElem.appendChild(addParkingLotBtn)
    parkingLotsPanel.appendChild(parkingLotListElem);
    

    return parkingLotsPanel;
}

function createParkingLotlist(sector, addbtn){
    let parkingLotList = document.createElement("ul");
    parkingLotList.className="parkingLotTileList";

    for(let i = 0; i<sector.parkingLots.length; i++){
        let parkingLotTile = createParkingLotTile(sector.parkingLots[i]);
        parkingLotList.appendChild(parkingLotTile);
    }
    parkingLotList.appendChild(addbtn);
    return parkingLotList;
}