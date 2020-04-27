package hu.hkristof.parkingapp.responsetypes;

import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkingLot;

public class ParkInResponse {
	private ParkingLot parkingLot;
	private Car car;
	private int sectorPlCount;
	
	
	public ParkingLot getParkingLot() {
		return parkingLot;
	}
	public void setParkingLot(ParkingLot parkinhLot) {
		this.parkingLot = parkinhLot;
	}
	public Car getCar() {
		return car;
	}
	public void setCar(Car car) {
		this.car = car;
	}
	public int getSectorPlCount() {
		return sectorPlCount;
	}
	public void setSectorPlCount(int sectorPlCount) {
		this.sectorPlCount = sectorPlCount;
	}
	
}
