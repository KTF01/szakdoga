package hu.hkristof.parkingapp.services;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.exceptions.CarNotFoundException;
import hu.hkristof.parkingapp.exceptions.ForbiddenOperationException;
import hu.hkristof.parkingapp.exceptions.UserNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.CarRepository;
import hu.hkristof.parkingapp.repositoris.UserRepository;

@Service
public class CarService {
	@Autowired
	CarRepository carRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	ParkingLotService parkingLotService;
	
	public List<Car> getAllCars(){
		System.out.println("Összes autó lekérdezve");
		return carRepository.findAll();
	}
	
	/**
	 * Ha a felhasználónak 5-nél kevesebb autója van akkor hozzáadásra kerül a paraméterben kapott autó.
	 * Ellenkező esetben hibaválaszt küld a szerver.
	 * @param userId A felhasználó azonosítója.
	 * @param car Az új autó amit hozzáadunk.
	 * @return A hozzáadott autó
	 */
	public Car addCarToUser(Long userId, Car car) {
		User user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException(userId));
		if(user.getOwnedCars().size()<5) {
			user.addCar(car);
		}else {
			throw new ForbiddenOperationException("HAS_FIVE_CARS");
		}
		userRepository.save(user);
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+user.getFirstName() +" felhasználónak új autó lett felvéve!");
		return car;
	}
	
	/**
	 * Ha az autó benne van az adatbázisban akkor eltávolítjuk. Ha áll valamelyik parkolóban akkor előtte kiállunk vele.
	 * @param plateNumber A törölni kívánt autó.
	 * @return A törölt autó rendszáma.
	 */
	public String deleteCar(String plateNumber) {
		Car car = carRepository.findById(plateNumber).orElseThrow(()->new CarNotFoundException(plateNumber));
		if(car.getOccupiedParkingLot()!=null) {
			parkingLotService.parkOut(car.getOccupiedParkingLot().getId());
		}
		car.getOwner().removeCar(car);
		carRepository.delete(car);
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+plateNumber + " rendszámú autó törölve!");
		return car.getPlateNumber();
	}
}
