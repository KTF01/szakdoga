package hu.hkristof.parkingapp.unit;

import static org.junit.Assert.assertTrue;

import java.sql.Timestamp;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringRunner;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.Role;
import hu.hkristof.parkingapp.exceptions.ForbiddenOperationException;
import hu.hkristof.parkingapp.exceptions.ReservationNotFoundException;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Reservation;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;
import hu.hkristof.parkingapp.repositoris.ReservationRepository;
import hu.hkristof.parkingapp.repositoris.UserRepository;
import hu.hkristof.parkingapp.services.ReservationService;
import hu.hkristof.parkingapp.services.TimeLogService;

@RunWith(SpringRunner.class)
public class TestReservationService {
	
	@Mock
	ParkingLotRepository parkingLotRepository;
	
	@Mock
	TimeLogService timeLogService;
	
	@Mock
	ReservationRepository reservationRepository;
	
	@Mock
	UserRepository userRespoitory;
	
	@Mock
	AuthenticatedUser authenticatedUser;
	
	@InjectMocks
	ReservationService reservationService;

	@Before
	public void init() {
		User testUserAuth = new User();
		testUserAuth.setId(1L);
		testUserAuth.setEmail("testemail@test.com");
		testUserAuth.setRole(Role.ROLE_ADMIN);
		
		User testUserHas3Reservations = new User();
		testUserHas3Reservations.setId(2L);
		testUserHas3Reservations.setEmail("testemail2@test.com");
		testUserHas3Reservations.setRole(Role.ROLE_USER);
		testUserHas3Reservations.addReservation(new Reservation());
		testUserHas3Reservations.addReservation(new Reservation());
		testUserHas3Reservations.addReservation(new Reservation());
		Optional<User> oUserAuth = Optional.of(testUserAuth);
		Optional<User> oUserTest = Optional.of(testUserHas3Reservations);
		Mockito.when(userRespoitory.findById(1L)).thenReturn(oUserAuth);
		Mockito.when(userRespoitory.findById(2L)).thenReturn(oUserTest);
		Mockito.when(authenticatedUser.getUser()).thenReturn(testUserAuth);
	}
	
	@Test
	public void testReservParkingLot() {
		ParkingLot pl = new ParkingLot();
		pl.setName("TestPl");
		pl.setId(1L);
		Optional<ParkingLot> oPl = Optional.of(pl);
		//Amikor a findById kerülne meghívásra, csak visszaadjuk a pl parkolót.
		Mockito.when(parkingLotRepository.findById(Mockito.anyLong())).thenReturn(oPl);
		Timestamp startTimeTime = new Timestamp(System.currentTimeMillis());
		Reservation res = reservationService.reserveParkingLot(1L, 1L, startTimeTime, 360000L);
		assertTrue(pl.getIsReserved()&&pl.getReservation().getId()==res.getId());
	}
	
	@Test(expected = ForbiddenOperationException.class)
	public void testReservParkingLotUserHasThreeReservations() {
		ParkingLot pl = new ParkingLot();
		pl.setName("TestPl");
		pl.setId(1L);
		Optional<ParkingLot> oPl = Optional.of(pl);
		Mockito.when(parkingLotRepository.findById(Mockito.anyLong())).thenReturn(oPl);
		Timestamp startTimeTime = new Timestamp(System.currentTimeMillis());
		reservationService.reserveParkingLot(1L, 2L, startTimeTime, 360000L);
	}
	
	@Test
	public void testDeleteReservation() {
		ParkingLot pl = new ParkingLot();
		pl.setName("TestPl");
		pl.setId(1L);
		Optional<ParkingLot> oPl = Optional.of(pl);
		Mockito.when(parkingLotRepository.findById(Mockito.anyLong())).thenReturn(oPl);
		Timestamp startTimeTime = new Timestamp(System.currentTimeMillis());
		Reservation res = reservationService.reserveParkingLot(1L, 1L, startTimeTime, 360000L);
		Optional<Reservation> oRes = Optional.of(res);
		Mockito.when(reservationRepository.findById(Mockito.anyLong())).thenReturn(oRes);
		assertTrue(reservationService.processDeleteReservation(1L).getId()==1L);
	}
	
	@Test(expected = ReservationNotFoundException.class)
	public void testDeleteReservationError() {
		ParkingLot pl = new ParkingLot();
		pl.setName("TestPl");
		pl.setId(1L);
		Optional<ParkingLot> oPl = Optional.of(pl);
		Mockito.when(parkingLotRepository.findById(Mockito.anyLong())).thenReturn(oPl);
		Timestamp startTimeTime = new Timestamp(System.currentTimeMillis());
		Reservation res = reservationService.reserveParkingLot(1L, 1L, startTimeTime, 360000L);
		Optional<Reservation> oRes = Optional.of(res);
		Mockito.when(reservationRepository.findById(1L)).thenReturn(oRes);
		Mockito.when(reservationRepository.findById(1L)).thenReturn(Optional.empty());
		reservationService.processDeleteReservation(2L).getId();
	}
}
