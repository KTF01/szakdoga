package hu.hkristof.parkingapp.unit;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.test.context.junit4.SpringRunner;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.LogAction;
import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Sector;
import hu.hkristof.parkingapp.models.TimeLog;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.TimeLogRepository;
import hu.hkristof.parkingapp.services.TimeLogService;

@RunWith(SpringRunner.class)
public class TestTimeLog {
	@Mock
	private TimeLogRepository timeLogRepository;
	
	@Mock
	private AuthenticatedUser authenticatedUser;
	
	@InjectMocks
	private TimeLogService timeLogService;
	
	ArrayList<TimeLog> testTimeLogs = new ArrayList<>();
	
	ParkingLot testParkingLot = new ParkingLot();
	
	@Before
	public void init() {
		testParkingLot.setId(1L);
		ParkHouse testPh = new ParkHouse();
		testPh.setId(1L);
		Sector testSector = new Sector();
		testSector.setId(1L);
		testPh.addSector(testSector);
		testSector.addParkingLot(testParkingLot);
		User testAuthUser = new User();
		testAuthUser.setFirstName("Teszt");
		testAuthUser.setLastName("János");
		testAuthUser.setId(1L);
		testAuthUser.setEmail("auth@gmail.com");
		Mockito.when(authenticatedUser.getUser()).thenReturn(testAuthUser);
		Mockito.when(timeLogRepository.save(Mockito.any(TimeLog.class))).thenAnswer(invocation->{
			testTimeLogs.add(invocation.getArgument(0));
			return invocation.getArgument(0);
			});
	}
	
	@Test
	public void testSaveParkLog() {
		Car car = new Car();
		car.setPlateNumber("ABC-123");
		car.setOwner(authenticatedUser.getUser());
		timeLogService.saveParkLog(LogAction.PARK_IN, car, testParkingLot);
		assertTrue(testTimeLogs.size()==1);
	}
	@Test
	public void testSaveParkLogNotParkAction() {
		Car car = new Car();
		car.setPlateNumber("ABC-123");
		car.setOwner(authenticatedUser.getUser());
		timeLogService.saveParkLog(LogAction.RESERVE_DELETE, car, testParkingLot);
		assertTrue(testTimeLogs.size()==0);
	}
	
	@Test
	public void testSaveSignUpLog() {
		User newUser = new User();
		newUser.setId(2L);
		newUser.setFirstName("Gipsz");
		newUser.setLastName("Jakab");
		timeLogService.saveSignUpLog(newUser);
		assertTrue(testTimeLogs.size()==1);
	}
	
	@Test
	public void testSaveReservation() {
		timeLogService.saveReserveLog(testParkingLot);
		assertTrue(testTimeLogs.get(0).getAction().equals(LogAction.RESERVE_MAKE));
	}
	
	@Test
	public void testDeleteReservation() {
		timeLogService.saveReserveDeleteLog(testParkingLot);
		assertTrue(testTimeLogs.get(0).getAction().equals(LogAction.RESERVE_DELETE));
	}
	
	@Test
	public void testDeleteReservationError() {
		Mockito.when(authenticatedUser.getUser()).thenThrow(BeanCreationException.class);
		timeLogService.saveReserveDeleteLog(testParkingLot);
		assertTrue(testTimeLogs.get(0).getUserName().equals("Rendszer"));
	}
}
