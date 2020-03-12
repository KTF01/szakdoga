package hu.hkristof.parkingapp.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.exceptions.ParkHouseNotFoundException;
import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.Section;
import hu.hkristof.parkingapp.repositoris.ParkHouseRepository;

@RestController
@RequestMapping("/parkHouses")
public class ParkHouseController {

	@Autowired
	ParkHouseRepository parkHouseRepository;
	
	@CrossOrigin
	@PostMapping("/newPH")
	public ParkHouse createNote(@Valid @RequestBody ParkHouse ph) {
		System.out.println(ph.getName()+" nevű parkolóház létrehozva!");
	    return parkHouseRepository.save(ph);
	}
	
	@CrossOrigin
	@GetMapping("/all")
	public List<ParkHouse> getAllParkhouse(){
		System.out.println("Parkolóházak lekérdezve!");
		return parkHouseRepository.findAll();
	}
	
	@CrossOrigin
	@GetMapping("/{id}")
	public ParkHouse getParkHouse(@PathVariable Long id) {
		System.out.println("Parkolóház lekérdezés!");
		return parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
	}
	
	@PutMapping("updatePH/{id}")
	public ParkHouse updateParkHouse(@PathVariable Long id, @Valid @RequestBody ParkHouse ph) {
		ParkHouse editPH = parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		editPH.setAddress(ph.getAddress());
		editPH.setName(ph.getName());
		editPH.setNumberOfFloors(ph.getNumberOfFloors());
		//editPH.setSections(ph.getSections());
		
		return parkHouseRepository.save(editPH);
	}
	
	@PutMapping("/addSection/{id}")
	public ParkHouse addSection(@PathVariable Long id, @Valid @RequestBody List<Section> newSections) {
		ParkHouse ph =  parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		for(Section sec : newSections) {
			ph.addSection(sec);
		}
		System.out.println(ph.getName()+" parkolóházhoz szekciók lettek hozzáadva!");
		return parkHouseRepository.save(ph);
	}
}
