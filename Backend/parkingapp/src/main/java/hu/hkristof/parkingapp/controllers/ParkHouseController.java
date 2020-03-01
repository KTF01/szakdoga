package hu.hkristof.parkingapp.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.exceptions.ParkHouseNotFoundException;
import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.repositoris.ParkHouseRepository;

@RestController
@RequestMapping("/parkHouses")
public class ParkHouseController {

	@Autowired
	ParkHouseRepository parkHouseRepository;
	
	@PostMapping("/newPH")
	public ParkHouse createNote(@Valid @RequestBody ParkHouse ph) {
		System.out.println(ph.getName()+" nevű parkolóház létrehozva!");
	    return parkHouseRepository.save(ph);
	}
	
	@GetMapping("/all")
	public List<ParkHouse> getAllParkhouse(){
		return parkHouseRepository.findAll();
	}
	
	@PutMapping("updatePH/{id}")
	public ParkHouse updateParkHouse(@PathVariable Long id, @Valid @RequestBody ParkHouse ph) {
		ParkHouse editPH = parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		editPH.setAdress(ph.getAdress());
		editPH.setName(ph.getName());
		editPH.setNumberOfFloors(ph.getNumberOfFloors());
		editPH.setSections(ph.getSections());
		
		return parkHouseRepository.save(editPH);
	}
}
