package hu.hkristof.parkingapp.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@RequestMapping("/cars")
public class CarController {
	
	@Autowired
	CarRepository carRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@GetMapping("/all")
	public List<Car> getAllNotes() {
		List<Car> cars = carRepository.findAll();
		
	    return cars;
	}
	
	@GetMapping("/{plateNumber}")
	public Car getCarById(@PathVariable String plateNumber) {
		return carRepository.findById(plateNumber).orElseThrow(()->new CarNotFoundException(plateNumber));
	}
	
	@PostMapping("/newCar")
	public Car createCar(@Valid @RequestBody Car car) {
		System.out.println("Új autó lett felvéve a rendszerbe: "+car.getPlateNumber());
	    return carRepository.save(car);
	}
	
	@PostMapping("/newCarToUser/{userId}")
	public Car addCarToUser(@PathVariable Long userId, @Valid @RequestBody Car car) {
		User user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException(userId));
		user.addCar(car);
		userRepository.save(user);
		System.out.println(user.getFirstName() +" felhasználónak új autó lett felvéve!");
		return car;
	}
	
	@GetMapping("/user/{id}")
	public List<Car> getCrasByUser(@PathVariable Long userId) {
		User user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException(userId));
		System.out.println(user.getFirstName() +" felhasználó autói lekérdezve.");
		return user.getOwnedCars();
	}
}
