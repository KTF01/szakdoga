package hu.hkristof.parkingapp.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;

@RestController
@RequestMapping("/parkingLots")
public class ParkingLotController {

	@Autowired
	ParkingLotRepository plRepository;
	
	
	// Get All ParkingLots
	@GetMapping("/all")
	public List<ParkingLot> getAllNotes() {
	    return plRepository.findAll();
	}
	
	
	// Create a new Parking Lot
	@PostMapping("/newPl")
	public ParkingLot createNote(@Valid @RequestBody ParkingLot pl) {
	    return plRepository.save(pl);
	}

}
