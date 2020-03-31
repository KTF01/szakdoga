function createParkingLotTile(){
    let plTile = document.createElement("div");
    plTile.className="parkingLotTile";
    return plTile;
}

function createParkingLotPanel(){
    let parkingLotsPanel = document.createElement("div");
    parkingLotsPanel.className="parkignLotsPanel";
    let parkingLotList = document.createElement("ul");
    parkingLotList.className="parkingLotTileList";

    for(let i = 0; i<5; i++){
        let parkingLotTile = createParkingLotTile();
        parkingLotList.appendChild(parkingLotTile);
    }

    parkingLotsPanel.appendChild(parkingLotList);

    return parkingLotsPanel;
}