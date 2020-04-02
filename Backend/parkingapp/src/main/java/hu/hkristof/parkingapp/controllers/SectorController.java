package hu.hkristof.parkingapp.controllers;

import java.util.List;

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

import hu.hkristof.parkingapp.exceptions.SectorNotFoundException;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Sector;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;
import hu.hkristof.parkingapp.repositoris.SectionRepository;

@RestController
@RequestMapping("/sectors")
public class SectorController {
	
	@Autowired
	SectionRepository sectorRepository;
	
	@Autowired
	ParkingLotRepository plRepository;
	
	@GetMapping("/all")
	public List<Sector> getAllNotes() {
	    return sectorRepository.findAll();
	}
	
	@PostMapping("/newSector")
	public Sector createSection(@Valid @RequestBody Sector sector) {
		
		System.out.println(sector.getName()+" nevű szekció létrehozva!");
		
		Sector newSector = sectorRepository.save(sector);
		for(ParkingLot pl : sector.getParkingLots()) {
			pl.setSector(sector);
		}
		plRepository.saveAll(sector.getParkingLots());
	    return newSector ;
	}
	
	@CrossOrigin
	@PutMapping("/addParkingLot/{id}")
	public Sector addParkingLot(@PathVariable Long id, @Valid @RequestBody List<ParkingLot> newParkingLots) {
		Sector sector = sectorRepository.findById(id).orElseThrow(()->new SectorNotFoundException(id));
		for(ParkingLot parkingLot : newParkingLots) {
			sector.addParkingLot(parkingLot);
		}
		System.out.println(sector.getName()+" szekcióhoz parkolóhelyek lettek hozzáadva!");
		return sectorRepository.save(sector);
	}
	
	@CrossOrigin
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Long> deleteSector(@PathVariable Long id)
	{
		Sector sector = sectorRepository.findById(id).orElseThrow(()->new SectorNotFoundException(id));
		sectorRepository.delete(sector);
		System.out.println(sector.getParkHouse().getName()+ " parkolóház "+ sector.getName()+" nevű szektora eltávolításra került.");
		
		return new ResponseEntity<>(id, HttpStatus.OK);
	}
}
