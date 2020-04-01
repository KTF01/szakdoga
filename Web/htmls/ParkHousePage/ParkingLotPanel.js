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
    let parkingLotList = document.createElement("ul");
    parkingLotList.className="parkingLotTileList";

    for(let i = 0; i<sector.parkingLots.length; i++){
        let parkingLotTile = createParkingLotTile(sector.parkingLots[i]);
        parkingLotList.appendChild(parkingLotTile);
    }

    parkingLotsPanel.appendChild(parkingLotList);

    return parkingLotsPanel;
}