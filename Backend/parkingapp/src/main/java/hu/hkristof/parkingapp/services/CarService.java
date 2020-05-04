package hu.hkristof.parkingapp.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.exceptions.CarNotFoundException;
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
	
	public Car addCarToUser(Long userId, Car car) {
		User user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException(userId));
		if(user.getOwnedCars().size()<5) {
			user.addCar(car);
		}else {
			return null;
		}
		userRepository.save(user);
		System.out.println(user.getFirstName() +" felhasználónak új autó lett felvéve!");
		return car;
	}
	
	public String deleteCar(String plateNumber) {
		Car car = carRepository.findById(plateNumber).orElseThrow(()->new CarNotFoundException(plateNumber));
		if(car.getOccupiedParkingLot()!=null) {
			parkingLotService.parkOut(car.getOccupiedParkingLot().getId());
		}
		car.getOwner().removeCar(car);
		carRepository.delete(car);
		System.out.println(plateNumber + " rendszámú autó törölve!");
		return car.getPlateNumber();
	}
}
