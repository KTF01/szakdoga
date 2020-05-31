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

/**
 * Parkolóházakkal kapcsolatos műveletek kontrollerje.
 * A parkHouseService segítségével előállítja a kérésekre a válaszokat.
 * @author krist
 *
 */
@RestController
@RequestMapping("auth/parkHouses")
public class ParkHouseController {
	
	@Autowired
	ParkHouseService parkHouseService;
	
	/**
	 * Új parkolóház hozzáadása. Csak adminisztrátorok érhetik el.
	 * @param ph A kérésből jön az új parkolóház modellje ami létre fog jönni.
	 * @return Az új parkolóház
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@PostMapping("/newPH")
	public ResponseEntity<ParkHouse> createParkHouse(@Valid @RequestBody ParkHouse ph) {
	    return new ResponseEntity<ParkHouse>(parkHouseService.createParkHouse(ph), HttpStatus.OK);
	}
	
	/**
	 * Az összes parkolóház és a benne található összes entitás (Autók, Foglalások) lekérdezésére szolgáló végpont.
	 * @return AllParkHousesResponse objektum ami tartalmaz minden szükséges információt.
	 */
	@CrossOrigin
	@GetMapping("/all")
	public ResponseEntity<AllParkHousesResponse> getAllParkHouses(){
		return ResponseEntity.ok().header("content-type", "application/json; charset=utf-8")
				.body(parkHouseService.getAllParkhouses());
	}
	
	/**
	 * Egy parkolóház felülírása. Csak a név, cím, koordináták és az emeletek kerülnek beállításra.
	 * Csak adminisztrátorok számára elérhető.
	 * @param id A felülírandó parkolóház azonosítója.
	 * @param ph A kérésben érkező módosított parakolóház amivel felülírjuk a régét.
	 * @return Maga a módosított parkolóház.
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@PutMapping("/updatePH/{id}")
	public ResponseEntity<ParkHouse> updateParkHouse(@PathVariable Long id, @Valid @RequestBody ParkHouse ph) {
		return new ResponseEntity<>(parkHouseService.updateParkHouse(id, ph), HttpStatus.OK);
	}
	
	/**
	 * Szektorok hozzáadása egy parkolóházhoz.
	 * @param id A parkolóház azonosítója
	 * @param newSectors A kérésből jövő új szektorok listája
	 * @return A parkolóház az újonnan felvett szektorokkal.
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@PutMapping("/addSectors/{id}")
	public ResponseEntity<ParkHouse> addSectors(@PathVariable Long id, @Valid @RequestBody List<Sector> newSectors) {
		return new ResponseEntity<>(parkHouseService.addSectors(id, newSectors), HttpStatus.OK);
	}
	
	/**
	 * Parkolóház törlése.
	 * @param id A törölni kívánt parkolóház azonosítója.
	 * @return
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@CrossOrigin
	@DeleteMapping("delete/{id}")
	public ResponseEntity<Long> deleteParkHouse(@PathVariable Long id) {
		return new ResponseEntity<Long>(parkHouseService.deleteParkHouse(id), HttpStatus.OK);
	}
	
}
