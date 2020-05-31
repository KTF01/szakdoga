package hu.hkristof.parkingapp.responsetypes;

import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Reservation;

/**
 * Beparkolás requestre küldendő válasz típus.
 * @author krist
 *
 */
public class ParkInResponse {
	private ParkingLot parkingLot;
	private Car car;
	private Reservation reservation;
	//A felületek számára szükség van a parkolás utáni számokra a parkolőházban.
	private int sectorPlCount;
	private int parkHouseFreePlCount;
	private int parkHouseOccupiedPlCount;
	
	public int getParkHouseOccupiedPlCount() {
		return parkHouseOccupiedPlCount;
	}
	public void setParkHouseOccupiedPlCount(int parkHouseOccupiedPlCount) {
		this.parkHouseOccupiedPlCount = parkHouseOccupiedPlCount;
	}
	public int getParkHouseFreePlCount() {
		return parkHouseFreePlCount;
	}
	public void setParkHouseFreePlCount(int parkHouseFreePlCount) {
		this.parkHouseFreePlCount = parkHouseFreePlCount;
	}
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
	public Reservation getReservation() {
		return reservation;
	}
	public void setReservation(Reservation reservation) {
		this.reservation = reservation;
	}
	
	
}
