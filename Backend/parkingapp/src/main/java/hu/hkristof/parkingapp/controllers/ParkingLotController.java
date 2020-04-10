package hu.hkristof.parkingapp.controllers;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.exceptions.ParkingLotNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.TimeLog;
import hu.hkristof.parkingapp.repositoris.CarRepository;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;
import hu.hkristof.parkingapp.repositoris.TimeLogRepository;

@CrossOrigin
@RestController
@RequestMapping("/parkingLots")
public class ParkingLotController {

	@Autowired
	ParkingLotRepository plRepository;
	
	@Autowired
	CarRepository carRepository;
	
	@Autowired
	TimeLogRepository timeLogRepository;
	
	
	@GetMapping("/all")
	public List<ParkingLot> getAllNotes() {
		System.out.println("Parkoló helyek lekérdezve!");
	    return plRepository.findAll();
	}
	
	@GetMapping("{id}")
	public ParkingLot getParkingLotById(@PathVariable Long id) {
		System.out.println(id+" számú parkolóhely lekérdezve!");
		return plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
	}
	
	@PostMapping("/newPl")
	public ParkingLot createNote(@Valid @RequestBody ParkingLot pl) {
		System.out.println(pl.getName()+" nevű parkolóhely létrehozva!");
	    return plRepository.save(pl);
	}
	
	@PutMapping("update/{id}")
	public ParkingLot updateParkingLot(@PathVariable Long id, @RequestBody String newName) {
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		String oldName = pl.getName();
		pl.setName(newName);
		System.out.println(oldName+" parkolóhelynek új név lett beállítva: "+ pl.getName());
		return plRepository.save(pl);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Long> deletePrakingLot(@PathVariable Long id) {
		System.out.println(id + " számú parkolóhely törölve!");
		plRepository.deleteById(id);
		return new ResponseEntity<>(id, HttpStatus.OK);
	}
	
	@PutMapping("/parkIn/{id}")
	public ParkingLot parkIn(@Valid @RequestBody Car car, @PathVariable Long id ) {
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		pl.setOccupiingCar(car);
		car.setPlId(id);
		plRepository.save(pl);
		carRepository.save(car);
		
		TimeLog timeLog = new TimeLog();
		timeLog.setIsParkedIn(true);
		timeLog.setTime(new Timestamp(System.currentTimeMillis()));
		timeLog.setCar(car);
		timeLogRepository.save(timeLog);
		System.out.println("A "+ car.getPlateNumber()+" rendszámú autó beparkolt a "+ pl.getName()+" nevű parkolóhelyre.");
		return pl;
	}
	
	@PutMapping("/parkOut/{id}")
	public ParkingLot parkOut(@PathVariable Long id) {
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		if(pl.getOccupiingCar()!=null) {
			Car car = pl.getOccupiingCar();
			car.setPlId(null);
			carRepository.save(car);
			pl.setOccupiingCar(null);
			plRepository.save(pl);
			TimeLog timeLog = new TimeLog();
			timeLog.setIsParkedIn(false);
			timeLog.setTime(new Timestamp(System.currentTimeMillis()));
			timeLog.setCar(car);
			timeLogRepository.save(timeLog);
		}
		return pl;
	}

}
