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
import org.springframework.test.context.junit4.SpringRunner;

import hu.hkristof.parkingapp.exceptions.ForbiddenOperationException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.CarRepository;
import hu.hkristof.parkingapp.repositoris.UserRepository;
import hu.hkristof.parkingapp.services.CarService;
import hu.hkristof.parkingapp.services.ParkingLotService;

@RunWith(SpringRunner.class)
public class TestCarService {
	
	
	@Mock
	CarRepository carRepository;
	
	@Mock
	UserRepository userRepository;
	
	@Mock
	ParkingLotService parkingLotService;
	
	@InjectMocks
	CarService carService;
	
	@Before
	public void init() {
		ArrayList<Car> cars = new ArrayList<>();
		Car car1 = new Car(); car1.setPlateNumber("ABC-123");
		Car car2 = new Car(); car2.setPlateNumber("ABC-124");
		Car car3 = new Car(); car3.setPlateNumber("ABC-125");
		cars.add(car1);cars.add(car2);cars.add(car3);
		Mockito.when(carRepository.findAll()).thenReturn(cars);
		Mockito.when(carRepository.findById("ABC-123")).thenReturn(Optional.of(car1));
		Mockito.when(carRepository.findById("asdasd")).thenReturn(Optional.empty());
		
		User mocUser = new User();
		mocUser.setId(2L);
		mocUser.setEmail("mock@gmail.com");
		mocUser.setFirstName("Mock");
		mocUser.setLastName("János");
		mocUser.addCar(new Car());
		mocUser.addCar(new Car());
		mocUser.addCar(new Car());
		mocUser.addCar(new Car());
		Optional<User> userOpt = Optional.of(mocUser);
		Mockito.when(userRepository.findById(2L)).thenReturn(userOpt);
	}
	
	@Test
	public void testGetAllCars() {
		assertTrue(carService.getAllCars().size()==3);
	}
	
	@Test
	public void testAddCarCarsLesThanFive() {
		Car car = new Car();
		car.setPlateNumber("ABC-123");
		carService.addCarToUser(2L, car);
		assertTrue(car.getOwner().getId()==2L&& car.getOwner().getOwnedCars().size()==5);
	}
	
	@Test(expected = ForbiddenOperationException.class)
	public void testAddCarCarsMoreThanFive() {
		Car car = new Car();
		car.setPlateNumber("ABC-123");
		carService.addCarToUser(2L, car);
		carService.addCarToUser(2L, new Car());
	}
	
	@Test
	public void testDeleteCar() {
		Car car = carRepository.findAll().get(0);
		carRepository.delete(car);
		assertTrue(car.getOccupiedParkingLot()==null);
	}
}
