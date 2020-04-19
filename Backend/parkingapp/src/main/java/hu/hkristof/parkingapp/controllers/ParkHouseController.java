package hu.hkristof.parkingapp.controllers;

import java.util.ArrayList;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.exceptions.ParkHouseNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Sector;
import hu.hkristof.parkingapp.repositoris.CarRepository;
import hu.hkristof.parkingapp.repositoris.ParkHouseRepository;
import hu.hkristof.parkingapp.responsetypes.AllParkHousesResponse;

@RestController
@RequestMapping("auth/parkHouses")
public class ParkHouseController {

	@Autowired
	ParkHouseRepository parkHouseRepository;
	
	@Autowired
	CarRepository carRespository;
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@PostMapping("/newPH")
	public ParkHouse createNote(@Valid @RequestBody ParkHouse ph) {
		System.out.println(ph.getName()+" nevű parkolóház létrehozva!");
	    return parkHouseRepository.save(ph);
	}
	
	@CrossOrigin
	@GetMapping("/all")
	public AllParkHousesResponse getAllParkhouse(){
		AllParkHousesResponse response =  new AllParkHousesResponse();
		List<ParkHouse> parkHouses =  parkHouseRepository.findAll();
		List<Car> cars =  new ArrayList<>();
		
		for(ParkHouse ph : parkHouses) {
			for(Sector sector : ph.getSectors()) {
				for(ParkingLot pl : sector.getParkingLots()) {
					if(pl.getOccupiingCar()!=null) {
						cars.add(pl.getOccupiingCar());
					}
				}
			}
		}
		
		response.setParkHouses(parkHouses);
		response.setCars(cars);
		System.out.println("Parkolóházak lekérdezve!");
		
		return response;
	}
	
	@CrossOrigin
	@GetMapping("/{id}")
	public ParkHouse getParkHouse(@PathVariable Long id) {

		System.out.println("Parkolóház lekérdezés!");
		return parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@PutMapping("/updatePH/{id}")
	public ParkHouse updateParkHouse(@PathVariable Long id, @Valid @RequestBody ParkHouse ph) {

		ParkHouse editPH = parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		String oldName = editPH.getName();
		editPH.setAddress(ph.getAddress());
		editPH.setName(ph.getName());
		editPH.setNumberOfFloors(ph.getNumberOfFloors());
		//editPH.setSections(ph.getSections());
		System.out.println(oldName +" nevű parkolóház módosítva lett! Új név: "+ editPH.getName());
		return parkHouseRepository.save(editPH);
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@PutMapping("/addSectors/{id}")
	public ParkHouse addSectors(@PathVariable Long id, @Valid @RequestBody List<Sector> newSections) {

		ParkHouse ph =  parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		for(Sector sec : newSections) {
			ph.addSection(sec);
		}
		System.out.println(ph.getName()+" parkolóházhoz szektorok lettek hozzáadva!");
		return parkHouseRepository.save(ph);
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@DeleteMapping("delete/{id}")
	public ResponseEntity<Long> deleteParkHouse(@PathVariable Long id) {

		ParkHouse ph = parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		System.out.println(ph.getName()+" nevű parkolóház törölve!");
		parkHouseRepository.delete(ph);
		return new ResponseEntity<Long>(id, HttpStatus.OK);
	}
	
}
