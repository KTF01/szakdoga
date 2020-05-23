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

import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.services.CarService;

@CrossOrigin
@RestController
@RequestMapping("auth/cars")
public class CarController {
	
	@Autowired
	CarService carService;
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@GetMapping("/all")
	public List<Car> getAllCars() {
	    return carService.getAllCars();
	}
	
	@PostMapping("/newCarToUser/{userId}")
	public ResponseEntity<Car> addCarToUser(@PathVariable Long userId, @Valid @RequestBody Car car) {
		 Car modifiedCar = carService.addCarToUser(userId, car);
		if(modifiedCar==null) {
			return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
		}else {
			return new ResponseEntity<Car>(car, HttpStatus.OK);
		}
		
	}
	
	@DeleteMapping("delete/{plateNumber}")
	public ResponseEntity<String> deleteCar(@PathVariable String plateNumber){
		return new ResponseEntity<>("{ \"plateNumber\": \""+ carService.deleteCar(plateNumber)+"\" }", HttpStatus.OK);
	}
}
