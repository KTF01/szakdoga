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
	
	/**
	 * Az összes autó lekérdezése
	 * @return A lekérdezett autók listája
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@GetMapping("/all")
	public List<Car> getAllCars() {
	    return carService.getAllCars();
	}
	
	/**
	 * Új autó hozzáadása egy felhasználóhoz.
	 * @param userId A felhasználó azonosítója
	 * @param car Az autó amit hozzáadunk
	 * @return Az újonnan létrehozott autó
	 */
	@PostMapping("/newCarToUser/{userId}")
	public ResponseEntity<Car> addCarToUser(@PathVariable Long userId, @Valid @RequestBody Car car) {
		 Car modifiedCar = carService.addCarToUser(userId, car);
		if(modifiedCar==null) {
			return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
		}else {
			return new ResponseEntity<Car>(car, HttpStatus.OK);
		}
		
	}
	
	/**
	 * Autó eltávolítása
	 * @param plateNumber Az eltávolítandó autó rendszáma
	 * @return Az eltávolított autó rendszáma
	 */
	@DeleteMapping("delete/{plateNumber}")
	public ResponseEntity<String> deleteCar(@PathVariable String plateNumber){
		return new ResponseEntity<>("{ \"plateNumber\": \""+ carService.deleteCar(plateNumber)+"\" }", HttpStatus.OK);
	}
}
