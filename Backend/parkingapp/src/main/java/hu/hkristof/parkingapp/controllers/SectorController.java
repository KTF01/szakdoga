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

import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Sector;
import hu.hkristof.parkingapp.services.SectorService;

@CrossOrigin
@RestController
@RequestMapping("auth/sectors")
public class SectorController {
	
	@Autowired
	SectorService sectorService;
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@PostMapping("newSector")
	public ResponseEntity< Sector> createSector(@Valid @RequestBody Sector sector) {
		return new ResponseEntity<>( sectorService.createSector(sector), HttpStatus.OK);
	}
	
	@GetMapping("all")
	public List<Sector> getAllSectors(){
		return sectorService.getAll();
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@PutMapping("addParkingLot/{id}")
	public ResponseEntity<Sector> addParkingLot(@PathVariable Long id, @Valid @RequestBody List<ParkingLot> newParkingLots) {
		return new ResponseEntity<Sector>(sectorService.addParkingLot(id, newParkingLots), HttpStatus.OK);
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@DeleteMapping("delete/{id}")
	public ResponseEntity<Long> deleteSector(@PathVariable Long id)
	{
		return new ResponseEntity<>(sectorService.deleteSector(id), HttpStatus.OK);
	}
	
}
