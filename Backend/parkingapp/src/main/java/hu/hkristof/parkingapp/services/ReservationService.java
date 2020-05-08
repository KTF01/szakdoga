package hu.hkristof.parkingapp.services;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.ParkingLotStatus;
import hu.hkristof.parkingapp.Role;
import hu.hkristof.parkingapp.exceptions.ParkingLotNotFoundException;
import hu.hkristof.parkingapp.exceptions.ReservationNotFoundException;
import hu.hkristof.parkingapp.exceptions.UserNotFoundException;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Reservation;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;
import hu.hkristof.parkingapp.repositoris.ReservationRepository;
import hu.hkristof.parkingapp.repositoris.UserRepository;

@Service
public class ReservationService {
	
	@Autowired
	ReservationRepository reservationRepository;

	@Autowired
	ParkingLotRepository parkingLotRespository;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	AuthenticatedUser authenticatedUser;
	
	@Transactional
	public Reservation reserveParkingLot(Long plId, Long userId,Timestamp startTime, Long duration ) {
		ParkingLot parkingLot = parkingLotRespository.findById(plId).orElseThrow(()->new ParkingLotNotFoundException(plId));
		User user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException(userId));
		if((user.getRole().equals(Role.ROLE_USER) && authenticatedUser.getUser().getId()!=user.getId()) ||
				!parkingLot.getStatus().equals(ParkingLotStatus.EMPTY)) {
			return null;
		}else{
			Reservation reservation = new Reservation();
			user.addReservation(reservation);
			reservation.setParkingLot(parkingLot);
			parkingLot.setStatus(ParkingLotStatus.RESERVED);
			parkingLot.setReservation(reservation);
			reservation.setStartTime(startTime);
			Timestamp endTime = new Timestamp(startTime.getTime()+duration);
			reservation.setEndTime(endTime);
			reservationRepository.save(reservation);
			parkingLotRespository.save(parkingLot);
			userRepository.save(user);
			return reservation;
		}
	}
	
	@Transactional
	@Scheduled(fixedDelay = 60000, initialDelay = 60000)
	public void purgeExpiredReservations() {
		Timestamp nowTime = new Timestamp(System.currentTimeMillis());
		List<Reservation> reservations = reservationRepository.findAllExpired(nowTime.toString());
		for(Reservation reservation : reservations) {
			System.out.println(nowTime.toString()+": "+reservation.getId()+" számú foglalás törölve");
			deleteReservation(reservation.getId());
		}
	}
	
	@Transactional
	public ParkingLot deleteReservation(Long resId) {
		Reservation reservation = reservationRepository.findById(resId).orElseThrow(()->new ReservationNotFoundException(resId));
		ParkingLot pl = reservation.getParkingLot();
		if(pl.getOccupyingCar()!=null) {
			pl.setStatus(ParkingLotStatus.OCCUPIED);
		}else {
			pl.setStatus(ParkingLotStatus.EMPTY);
		}
		pl.setReservation(null);
		reservation.getUser().removeReservation(reservation);
		parkingLotRespository.save(pl);
		reservationRepository.delete(reservation);
		System.out.println(pl.getName()+" nevű parkolóhelyről eltávolításra került a foglalás. Foglalás ID: "+reservation.getId());
		return pl;
	}
}
