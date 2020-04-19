package hu.hkristof.parkingapp.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import hu.hkristof.parkingapp.exceptions.CarNotFoundException;
import hu.hkristof.parkingapp.exceptions.UserNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.CarRepository;
import hu.hkristof.parkingapp.repositoris.UserRepository;
import hu.hkristof.parkingapp.services.ParkingLotService;

@CrossOrigin
@RestController
@RequestMapping("auth/cars")
public class CarController {
	
	@Autowired
	CarRepository carRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	ParkingLotService parkingLotService;
	
	@Secured({"ROLE_ADMIN"})
	@GetMapping("/all")
	public List<Car> getAllNotes() {
		List<Car> cars = carRepository.findAll();
		
	    return cars;
	}
	
	@GetMapping("/{plateNumber}")
	public Car getCarById(@PathVariable String plateNumber) {
		return carRepository.findById(plateNumber).orElseThrow(()->new CarNotFoundException(plateNumber));
	}
	
	@Secured({"ROLE_ADMIN"})
	@PostMapping("/newCar")
	public Car createCar(@Valid @RequestBody Car car) {
		System.out.println("Új autó lett felvéve a rendszerbe: "+car.getPlateNumber());
	    return carRepository.save(car);
	}
	
	@PostMapping("/newCarToUser/{userId}")
	public ResponseEntity<Car> addCarToUser(@PathVariable Long userId, @Valid @RequestBody Car car) {
		User user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException(userId));
		if(user.getOwnedCars().size()<5) {
			user.addCar(car);
		}else {
			return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
		}
		
		userRepository.save(user);
		System.out.println(user.getFirstName() +" felhasználónak új autó lett felvéve!");
		return new ResponseEntity<Car>(car, HttpStatus.OK);
	}
	
	@GetMapping("/user/{id}")
	public List<Car> getCrasByUser(@PathVariable Long userId) {
		User user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException(userId));
		System.out.println(user.getFirstName() +" felhasználó autói lekérdezve.");
		return user.getOwnedCars();
	}
	
	@DeleteMapping("delete/{plateNumber}")
	public ResponseEntity<List<Car>> deleteCar(@PathVariable String plateNumber){
		Car car = carRepository.findById(plateNumber).orElseThrow(()->new CarNotFoundException(plateNumber));
		User owner = car.getOwner();
		car.getOwner().removeCar(car);
		if(car.getOccupiedParkingLot()!=null) {
			parkingLotService.parkOut(car.getOccupiedParkingLot().getId());
		}
		carRepository.delete(car);
		System.out.println(plateNumber + " rendszámú autó törölve!");
		return new ResponseEntity<>(owner.getOwnedCars(), HttpStatus.OK);
	}
}
