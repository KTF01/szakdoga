package hu.hkristof.parkingapp.services;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.exceptions.ForbiddenOperationException;
import hu.hkristof.parkingapp.exceptions.ParkingLotNotFoundException;
import hu.hkristof.parkingapp.exceptions.ReservationNotFoundException;
import hu.hkristof.parkingapp.exceptions.UserNotFoundException;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Reservation;
import hu.hkristof.parkingapp.models.Role;
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
	TimeLogService timeLogService;
	
	@Autowired
	AuthenticatedUser authenticatedUser;
	
	/**
	 * Parkoló lefoglalásána, ha nincs még három foglalása a felhasználónak.
	 * @param plId A foglalásra szánt parkoló azonosítója.
	 * @param userId A felhasználó azonosítója.
	 * @param startTime A fogalalás kezdete
	 * @param duration A foglalás hossza
	 * @return Az új golalás objektuma.
	 */
	@Transactional
	public Reservation reserveParkingLot(Long plId, Long userId,Timestamp startTime, Long duration ) {
		ParkingLot parkingLot = parkingLotRespository.findById(plId).orElseThrow(()->new ParkingLotNotFoundException(plId));
		User user = userRepository.findById(userId).orElseThrow(()->new UserNotFoundException(userId));
		int resCount = user.getReservations().size();
		//Ha foglalt a parkoló vagy nem adminisztártorként nem a saját nevében akar foglalni akkor hiba.
		if((authenticatedUser.getUser().getRole().equals(Role.ROLE_USER) && authenticatedUser.getUser().getId()!=user.getId()) ||
				parkingLot.getIsReserved()) {
			throw new ForbiddenOperationException("RESERVATION_BLOCKED");
		}else if(resCount>2) { 
			throw new ForbiddenOperationException("USER_HAS_THREE_RESERVATIONS");
		}
		//Ha nem a sajt autója áll a parkolóban, akkor se szabad foglalni.
		else if(parkingLot.getOccupyingCar()!=null && parkingLot.getOccupyingCar().getOwner().getId()!=authenticatedUser.getUser().getId()) {
			throw new ForbiddenOperationException("NOT_OWNED_CAR");
		}else{
			System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
					": "+"Foglalás!");
			Reservation reservation = new Reservation();
			user.addReservation(reservation);
			reservation.setParkingLot(parkingLot);
			parkingLot.setIsReserved(true);
			parkingLot.setReservation(reservation);
			reservation.setStartTime(startTime);
			Timestamp endTime = new Timestamp(startTime.getTime()+duration);
			reservation.setEndTime(endTime);
			//Ha állnak a parkolóban autóval akkkor nem kell csökkenteni a szabad parkolók számát.
			if(parkingLot.getOccupyingCar()==null) {
				parkingLot.getSector().decraseCount();
			}
			reservationRepository.save(reservation);
			parkingLotRespository.save(parkingLot);
			userRepository.save(user);
			//Lementünk egy naplóbejegyzést.
			timeLogService.saveReserveLog(parkingLot);
			return reservation;
		}
	}
	
	/**
	 * Percenként lefut és kitörli a lejárt foglalásokat
	 */
	@Transactional
	@Scheduled(fixedDelay = 60000, initialDelay = 60000)
	public void purgeExpiredReservations() {
		Timestamp nowTime = new Timestamp(System.currentTimeMillis());
		List<Reservation> reservations = reservationRepository.findAllExpired(nowTime.toString());
		for(Reservation reservation : reservations) {
			System.out.println(nowTime.toString()+": "+reservation.getId()+" számú foglalás törölve");
			deleteReservation(reservation);
		}
	}
	
	/**
	 * Eltávolít egy fogalást az adatbázisból.
	 * @param reservation Az eltávolítandó foglalás.
	 * @return A parkolóhely ami már nem foglalt.
	 */
	@Transactional
	public ParkingLot deleteReservation(Reservation reservation) {
		ParkingLot pl = reservation.getParkingLot();
		pl.setIsReserved(false);
		pl.setReservation(null);
		reservation.getUser().removeReservation(reservation);
		if(pl.getOccupyingCar()==null) {
			pl.getSector().increasePlCount();
		}
		parkingLotRespository.save(pl);
		reservationRepository.delete(reservation);
		timeLogService.saveReserveDeleteLog(reservation.getParkingLot());
		System.out.println(pl.getName()+" nevű parkolóhelyről eltávolításra került a foglalás. Foglalás ID: "+reservation.getId());
		return pl;
	}
	
	/**
	 * Foglalás törlésének manuális elindítása.
	 * @param resId Törlendő fogallás azonosítója.
	 * @return A felszabadult parkoló.
	 */
	public ParkingLot processDeleteReservation(Long resId) {
		Reservation reservation = reservationRepository.findById(resId).orElseThrow(()->new ReservationNotFoundException(resId));
		//Ha nem adminisztrátor a user akkor csak saját foglalást mondhat le.
		if(authenticatedUser.getUser().getRole().equals(Role.ROLE_USER)&&
				reservation.getUser().getId()!=authenticatedUser.getUser().getId()) {
			throw new ForbiddenOperationException("USER_NOT_ADMIN_NOT_OWNER_OF_RESERVATION");
		}else {
			return deleteReservation(reservation);
		}
		
	}
}
