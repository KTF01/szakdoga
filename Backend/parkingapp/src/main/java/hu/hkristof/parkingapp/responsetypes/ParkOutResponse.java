package hu.hkristof.parkingapp.responsetypes;

import hu.hkristof.parkingapp.models.ParkingLot;

public class ParkOutResponse {
	private ParkingLot parkingLot;
	
	private int freePlCount;

	public ParkingLot getParkingLot() {
		return parkingLot;
	}

	public void setParkingLot(ParkingLot parkingLot) {
		this.parkingLot = parkingLot;
	}

	public int getFreePlCount() {
		return freePlCount;
	}

	public void setFreePlCount(int freePlCount) {
		this.freePlCount = freePlCount;
	}
}
