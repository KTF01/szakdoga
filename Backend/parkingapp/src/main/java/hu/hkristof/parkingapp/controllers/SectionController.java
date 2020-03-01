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
import hu.hkristof.parkingapp.models.Section;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;
import hu.hkristof.parkingapp.repositoris.SectionRepository;

@RestController
@RequestMapping("/sections")
public class SectionController {
	
	@Autowired
	SectionRepository sectionRepository;
	
	@Autowired
	ParkingLotRepository plRepository;
	
	@GetMapping("/all")
	public List<Section> getAllNotes() {
	    return sectionRepository.findAll();
	}
	
	@PostMapping("/newSection")
	public Section createNote(@Valid @RequestBody Section section) {
		System.out.println(section.getName()+" nevű szekció létrehozva!");
		
		Section newSection = sectionRepository.save(section);
		for(ParkingLot pl : section.getParkingLots()) {
			pl.setSection(section);
		}
		plRepository.saveAll(section.getParkingLots());
	    return newSection ;
	}
}
