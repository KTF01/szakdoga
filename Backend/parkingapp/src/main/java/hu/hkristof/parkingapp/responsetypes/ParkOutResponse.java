package hu.hkristof.parkingapp.responsetypes;

import hu.hkristof.parkingapp.models.ParkingLot;

public class ParkOutResponse {
	private ParkingLot parkingLot;
	
	private int sectorFreePlCount;
	
	private int parkHouseFreePlCount;
	
	private int parkHouseOccupiedPlCount;
	
	public int getParkHouseOccupiedPlCount() {
		return parkHouseOccupiedPlCount;
	}

	public void setParkHouseOccupiedPlCount(int parkHouseOccupiedPlCount) {
		this.parkHouseOccupiedPlCount = parkHouseOccupiedPlCount;
	}

	public int getSectorFreePlCount() {
		return sectorFreePlCount;
	}

	public void setSectorFreePlCount(int sectorFreePlCount) {
		this.sectorFreePlCount = sectorFreePlCount;
	}

	public int getParkHouseFreePlCount() {
		return parkHouseFreePlCount;
	}

	public void setParkHouseFreePlCount(int parkHouseFreePlCount) {
		this.parkHouseFreePlCount = parkHouseFreePlCount;
	}

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
