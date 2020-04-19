package hu.hkristof.parkingapp.responsetypes;

import java.util.List;

import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkHouse;

public class AllParkHousesResponse {
	
	List<ParkHouse> parkHouses;
	
	List<Car> cars;

	public List<ParkHouse> getParkHouses() {
		return parkHouses;
	}

	public void setParkHouses(List<ParkHouse> parkHouses) {
		this.parkHouses = parkHouses;
	}

	public List<Car> getCars() {
		return cars;
	}

	public void setCars(List<Car> cars) {
		this.cars = cars;
	}
	
	
}
