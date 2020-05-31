package hu.hkristof.parkingapp.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
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
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.repositoris.CarRepository;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;
import hu.hkristof.parkingapp.repositoris.TimeLogRepository;
import hu.hkristof.parkingapp.responsetypes.ParkInResponse;
import hu.hkristof.parkingapp.responsetypes.ParkOutResponse;
import hu.hkristof.parkingapp.services.ParkingLotService;

@CrossOrigin
@RestController
@RequestMapping("/auth/parkingLots")
public class ParkingLotController {

	@Autowired
	ParkingLotRepository plRepository;
	
	@Autowired
	CarRepository carRepository;
	
	@Autowired
	TimeLogRepository timeLogRepository;
	
	@Autowired
	ParkingLotService parkingLotService;
	
	@GetMapping("/all")
	public List<ParkingLot> getAllParkingLot() {
		System.out.println("Parkoló helyek lekérdezve!");
	    return plRepository.findAll();
	}
	
	@GetMapping("{id}")
	public ParkingLot getParkingLotById(@PathVariable Long id) {
		System.out.println(id+" számú parkolóhely lekérdezve!");
		return plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@PostMapping("/newPl")
	public ParkingLot createParkingLot(@Valid @RequestBody ParkingLot pl) {
		System.out.println(pl.getName()+" nevű parkolóhely létrehozva!");
	    return plRepository.save(pl);
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@PutMapping("update/{id}")
	public ParkingLot updateParkingLot(@PathVariable Long id, @RequestBody String newName) {
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		String oldName = pl.getName();
		pl.setName(newName);
		System.out.println(oldName+" parkolóhelynek új név lett beállítva: "+ pl.getName());
		return plRepository.save(pl);
	}
	
	/**
	 * Parkoló hely törlése.
	 * @param id A parkoló azonosítója ami törlésre kerül.
	 * @return A törölt parkoló azonosítója
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Long> deletePrakingLot(@PathVariable Long id) {
		return new ResponseEntity<>(parkingLotService.deletePrakingLot(id), HttpStatus.OK);
	}
	
	/**
	 * Beparkolás végrehajtása.
	 * @param plId A parkoló azonosítója ahova beparkolunk.
	 * @param carPlate Az autó rendszáma amivel beparkolunk.
	 * @return ParkInResponse objektum.
	 */
	@Transactional
	@PutMapping("/parkIn/{plId}/{carPlate}")
	public ResponseEntity<ParkInResponse> parkIn(@PathVariable Long plId, @PathVariable String carPlate ) {
		ParkInResponse response = parkingLotService.parkIn(plId, carPlate);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	/**
	 * A kiparkolást végrehajtó végpont.
	 * @param id A parkoló azonosÍtója ahonnan a kiparkolás történik.
	 * @return
	 */
	@Transactional
	@PutMapping("/parkOut/{id}")
	public ResponseEntity<ParkOutResponse> parkOut(@PathVariable Long id) {
		return new ResponseEntity<>(parkingLotService.parkOut(id), HttpStatus.OK);
	}
	

}
