package hu.hkristof.parkingapp.responsetypes;

import java.util.List;

import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.Reservation;

/**
 * Összes parkolóház lekérdezésénél ennek az osztálynak egy példánya lesz a válasz.
 * Megléte Json serializációs okok miatt szükséges.
 * @author krist
 *
 */
public class AllParkHousesResponse {
	
	List<ParkHouse> parkHouses;
	
	List<Car> cars;
	
	List<Reservation> reservations;

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

	public List<Reservation> getReservations() {
		return reservations;
	}

	public void setReservations(List<Reservation> reservations) {
		this.reservations = reservations;
	}
}
