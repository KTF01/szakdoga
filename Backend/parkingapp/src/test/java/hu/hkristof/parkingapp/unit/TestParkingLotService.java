package hu.hkristof.parkingapp.unit;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.springframework.test.context.junit4.SpringRunner;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.Role;
import hu.hkristof.parkingapp.exceptions.CarNotFoundException;
import hu.hkristof.parkingapp.exceptions.ForbiddenOperationException;
import hu.hkristof.parkingapp.exceptions.ParkingLotNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Sector;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.CarRepository;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;
import hu.hkristof.parkingapp.responsetypes.ParkInResponse;
import hu.hkristof.parkingapp.responsetypes.ParkOutResponse;
import hu.hkristof.parkingapp.services.ParkingLotService;
import hu.hkristof.parkingapp.services.TimeLogService;

@RunWith(SpringRunner.class)
public class TestParkingLotService {
	
	@Mock
	ParkingLotRepository plRepository;
	
	@Mock
	CarRepository carRepository;
	
	@Mock
	TimeLogService timeLogService;
	
	@Mock
	AuthenticatedUser authenticatedUser;
	
	@InjectMocks
	ParkingLotService parkingLotService;
	
	@Before
	public void init() {
		
		User testAuthUser = new User();
		testAuthUser.setId(1L);
		testAuthUser.setRole(Role.ROLE_USER);
		User testUser = new User();
		testUser.setId(2L);
		testUser.setRole(Role.ROLE_USER);
		ArrayList<ParkingLot> testParkingLots = new ArrayList<>();
		ArrayList<Car> testCars = new ArrayList<>();
		
		ParkingLot p1 = new ParkingLot();
		p1.setId(1L);
		p1.setName("P1");
		p1.setOccupyingCar(new Car());
		p1.setSector(new Sector());
		p1.getSector().setFreePlCount(0);
		p1.getSector().setParkHouse(new ParkHouse());
		ParkingLot p2 = new ParkingLot();
		p2.setId(2L);
		p2.setName("P2");
		p2.setSector(new Sector());
		p2.getSector().setParkHouse(new ParkHouse());
		testParkingLots.add(p1); testParkingLots.add(p2);
		
		Car testCar1 = new Car(); testCar1.setPlateNumber("ABC-123"); testCar1.setOwner(testAuthUser);
		Car testCar2 = new Car(); testCar2.setPlateNumber("ABC-124"); testCar2.setOwner(testUser);
		Car testCar3 = new Car(); testCar3.setPlateNumber("ABC-125");
		testCars.add(testCar1);
		testCars.add(testCar2);
		testCars.add(testCar3);
		
		Mockito.when(plRepository.findById(Mockito.anyLong())).then((InvocationOnMock invocation)->{
			for(ParkingLot pl : testParkingLots) {
				if(pl.getId()== invocation.getArgument(0)) {
					return Optional.of(pl);
				}
			}
			throw new ParkingLotNotFoundException(invocation.getArgument(0));
		});
		Mockito.when(carRepository.findById(Mockito.anyString())).then((InvocationOnMock invocation)->{
			for(Car car : testCars) {
				if(car.getPlateNumber()== invocation.getArgument(0)) {
					return Optional.of(car);
				}
			}
			throw new CarNotFoundException(invocation.getArgument(0));
		});
		Mockito.when(authenticatedUser.getUser()).thenReturn(testAuthUser);
	}
	
	
	@Test
	public void testMassParkOut() {
		ArrayList<ParkingLot> testParkingLots = new ArrayList<>();
		ParkingLot p1 = new ParkingLot();
		p1.setId(1L); p1.setName("testP"); p1.setOccupyingCar(new Car());
		ParkingLot p2 = new ParkingLot();
		p2.setId(2L); p2.setName("testP2"); p2.setOccupyingCar(new Car());
		testParkingLots.add(p1);
		testParkingLots.add(p2);
		parkingLotService.massParkOut(testParkingLots);
		assertTrue(testParkingLots.get(0).getOccupyingCar()==null);
	}
	
	@Test 
	public void testParkOut() {
		ParkOutResponse testResponse = parkingLotService.parkOut(1L);
		assertTrue(testResponse.getParkingLot().getOccupyingCar()==null);
	}
	
	@Test(expected = ParkingLotNotFoundException.class)
	public void testParkOutError() {
		parkingLotService.parkOut(22L);
	}
	
	@Test
	public void testParkIn() {
		ParkInResponse testResponse = parkingLotService.parkIn(1L, "ABC-123");
		assertTrue(testResponse.getParkingLot().getOccupyingCar().getPlateNumber().equals("ABC-123"));
	}
	
	@Test(expected = CarNotFoundException.class)
	public void testParkInError() {
		parkingLotService.parkIn(1L, "ASD-123");
	}
	
	@Test(expected = ForbiddenOperationException.class)
	public void testParkInNotAdminNotSelfCar() {
		parkingLotService.parkIn(1L, "ABC-124");
	}
	
	@Test
	public void testParkInAdminNotSelfCar() {
		User adminUser = new User();
		adminUser.setRole(Role.ROLE_ADMIN);
		Mockito.when(authenticatedUser.getUser()).thenReturn(adminUser);
		ParkInResponse testResponse = parkingLotService.parkIn(1L, "ABC-124");
		assertTrue(testResponse.getParkingLot().getOccupyingCar().getPlateNumber().equals("ABC-124"));
	}
	
	@Test
	public void testDeleteParkingLot() {
		assertTrue(parkingLotService.deletePrakingLot(2L)==2L);
	}
	
	@Test(expected = ParkingLotNotFoundException.class)
	public void testDeleteParkingLotError() {
		parkingLotService.deletePrakingLot(3L);
	}
}
