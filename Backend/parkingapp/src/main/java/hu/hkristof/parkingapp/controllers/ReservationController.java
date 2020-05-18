package hu.hkristof.parkingapp.controllers;

import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.exceptions.ReservationNotFoundException;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Reservation;
import hu.hkristof.parkingapp.repositoris.ReservationRepository;
import hu.hkristof.parkingapp.services.ReservationService;

@CrossOrigin
@RestController
@RequestMapping("auth/reservations")
public class ReservationController {
	
	@Autowired
	ReservationRepository resRepo;
	
	@Autowired
	ReservationService reservationService;
	
	@PostMapping("reserve")
	public ResponseEntity<Reservation> makeReservation(@RequestParam("plId") Long plId,
													@RequestParam("userId") Long userId,
													@RequestParam("duration") Long duration){
		Timestamp startTimeTime = new Timestamp(System.currentTimeMillis());
		Reservation response = reservationService.reserveParkingLot(plId, userId, startTimeTime, duration);
		if(response == null) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
		return ResponseEntity.ok().header("content-type", "application/json; charset=utf-8").body(response);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Reservation> getReservation(@PathVariable Long id){
		Reservation res = resRepo.findById(id).orElseThrow(()->new ReservationNotFoundException(id));
		return new ResponseEntity<Reservation>(res, HttpStatus.OK);
	}
	
	@DeleteMapping("delete/{id}")
	public ResponseEntity<ParkingLot> deleteReservation(@PathVariable Long id){
		ParkingLot pl = reservationService.processDeleteReservation(id);
		if(pl==null) {
			return new ResponseEntity<ParkingLot>(HttpStatus.FORBIDDEN);
		}else {
			System.out.println("Rendelés törölve!");
			return new ResponseEntity<ParkingLot>(pl, HttpStatus.OK);
		}
		
	}
	
}
