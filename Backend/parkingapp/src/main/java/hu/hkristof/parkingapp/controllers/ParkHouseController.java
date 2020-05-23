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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.Sector;
import hu.hkristof.parkingapp.responsetypes.AllParkHousesResponse;
import hu.hkristof.parkingapp.services.ParkHouseService;

@RestController
@RequestMapping("auth/parkHouses")
public class ParkHouseController {
	
	@Autowired
	ParkHouseService parkHouseService;
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@PostMapping("/newPH")
	public ResponseEntity<ParkHouse> createParkHouse(@Valid @RequestBody ParkHouse ph) {
	    return new ResponseEntity<ParkHouse>(parkHouseService.createParkHouse(ph), HttpStatus.OK);
	}
	
	@CrossOrigin
	@GetMapping("/all")
	public ResponseEntity<AllParkHousesResponse> getAllParkHouses(){
		return ResponseEntity.ok().header("content-type", "application/json; charset=utf-8")
				.body(parkHouseService.getAllParkhouses());
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@PutMapping("/updatePH/{id}")
	public ResponseEntity<ParkHouse> updateParkHouse(@PathVariable Long id, @Valid @RequestBody ParkHouse ph) {
		return new ResponseEntity<>(parkHouseService.updateParkHouse(id, ph), HttpStatus.OK);
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@PutMapping("/addSectors/{id}")
	public ResponseEntity<ParkHouse> addSectors(@PathVariable Long id, @Valid @RequestBody List<Sector> newSectors) {
		return new ResponseEntity<>(parkHouseService.addSectors(id, newSectors), HttpStatus.OK);
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@DeleteMapping("delete/{id}")
	public ResponseEntity<Long> deleteParkHouse(@PathVariable Long id) {
		return new ResponseEntity<Long>(parkHouseService.deleteParkHouse(id), HttpStatus.OK);
	}
	
}
