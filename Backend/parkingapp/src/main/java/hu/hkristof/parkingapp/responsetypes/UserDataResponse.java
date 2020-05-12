package hu.hkristof.parkingapp.responsetypes;

import java.util.List;

import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.Reservation;
import hu.hkristof.parkingapp.models.User;

public class UserDataResponse {
	User user;
	List<Car> userCars;
	List<Reservation> userReservations;
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public List<Car> getUserCars() {
		return userCars;
	}
	public void setUserCars(List<Car> userCars) {
		this.userCars = userCars;
	}
	public List<Reservation> getUserReservations() {
		return userReservations;
	}
	public void setUserReservations(List<Reservation> userReservations) {
		this.userReservations = userReservations;
	}
	
}
