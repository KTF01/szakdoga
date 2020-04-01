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
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.repositoris.CarRepository;

@RestController
@RequestMapping("/cars")
public class CarController {
	
	@Autowired
	CarRepository carRepository;
	
	@GetMapping("/all")
	public List<Car> getAllNotes() {
	    return carRepository.findAll();
	}
	
	@GetMapping("{id}")
	public Car getCarById(@PathVariable String plateNumber) {
		return carRepository.findById(plateNumber).orElseThrow(()->new CarNotFoundException(plateNumber));
	}
	
	@PostMapping("/newCar")
	public Car createCar(@Valid @RequestBody Car car) {
	    return carRepository.save(car);
	}
}
