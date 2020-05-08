package hu.hkristof.parkingapp.unit;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.User;


public class TestUser {
	
	User user;
	
	@Before
	public void init() {
		user = new User();
		Car car = new Car();
		car.setPlateNumber("ASD-345");
		user.addCar(car);
	}
	
	@Test
	public void addcarTest() {
		Car car = new Car();
		car.setPlateNumber("ABC-123");
		user.addCar(car);
		assertTrue(user.getOwnedCars().contains(car) && car.getOwner().equals(user));
	}
	
	@Test
	public void removeCarTest() {
		Car car = user.getOwnedCars().get(0);
		user.removeCar(car);
		assertFalse(user.getOwnedCars().contains(car));
	}
}
