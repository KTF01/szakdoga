package hu.hkristof.parkingapp.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.LogAction;
import hu.hkristof.parkingapp.Role;
import hu.hkristof.parkingapp.exceptions.CarNotFoundException;
import hu.hkristof.parkingapp.exceptions.ParkingLotNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.repositoris.CarRepository;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;
import hu.hkristof.parkingapp.responsetypes.ParkInResponse;
import hu.hkristof.parkingapp.responsetypes.ParkOutResponse;

@Service
public class ParkingLotService {
	
	@Autowired
	ParkingLotRepository plRepository;
	
	@Autowired
	CarRepository carRepository;
	
	
	@Autowired
	TimeLogService timeLogService;
	
	@Autowired
	AuthenticatedUser authenticateduser;

	public void massParkOut(List<ParkingLot> parkingLots) {
		List<Car> cars= new ArrayList<>();
		for(ParkingLot parkingLot: parkingLots) {
			if(parkingLot.getOccupyingCar()!=null) {
				Car car = parkingLot.getOccupyingCar();
				car.setOccupiedParkingLot(null);
				parkingLot.setOccupyingCar(null);
				cars.add(car);
			}
		}
		carRepository.saveAll(cars);
		plRepository.saveAll(parkingLots);
	}
	
	public ParkOutResponse parkOut(Long id) {
		ParkOutResponse response = new ParkOutResponse();
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		if(pl.getOccupyingCar()!=null) {
			parkoutProcess(pl);
		}
		response.setParkingLot(pl);
		response.setFreePlCount(pl.getSector().getFreePlCount());
		return response;
	}
	
	private void parkoutProcess(ParkingLot pl) {
		Car car = pl.getOccupyingCar();
		car.setOccupiedParkingLot(null);
		carRepository.save(car);
		pl.setOccupyingCar(null);
		pl.getSector().increasePlCount();
		plRepository.save(pl);
		timeLogService.saveLog(LogAction.PARK_OUT,car, pl);
		System.out.println(pl.getName()+" parkolóból kiállt a "+ car.getPlateNumber()+" rendszámú autó!");
	}
	
	private void parkInProcess(ParkingLot pl, Car car) {
		if(car.getOccupiedParkingLot()!=null) {
			parkOut(car.getOccupiedParkingLot().getId());
		}
		pl.setOccupyingCar(car);
		pl.getSector().decraseCount();
		car.setOccupiedParkingLot(pl);
		plRepository.save(pl);
		carRepository.save(car);

		timeLogService.saveLog(LogAction.PARK_IN, car, pl);
		System.out.println("A "+ car.getPlateNumber()+" rendszámú autó beparkolt a "+ pl.getName()+" nevű parkolóhelyre.");
	}
	
	public ParkOutResponse parkOutSelf(Long id) {
		ParkOutResponse response = new ParkOutResponse();
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		if(pl.getOccupyingCar()!=null) {
			if(authenticateduser.getUser().getId()==pl.getOccupyingCar().getOwner().getId()) {
				parkoutProcess(pl);
			}else {
				return null;
			}
		}
		response.setParkingLot(pl);
		response.setFreePlCount(pl.getSector().getFreePlCount());
		return response;
	}
	
	public ParkInResponse parkIn(Long plId, String carPlate) {
		ParkInResponse response = new ParkInResponse();
		
		ParkingLot pl = plRepository.findById(plId).orElseThrow(()->new ParkingLotNotFoundException(plId));
		Car car = carRepository.findById(carPlate).orElseThrow(()->new CarNotFoundException(carPlate));
		if(authenticateduser.getUser().getRole().equals(Role.ROLE_USER)) {
			if(car.getOwner().getId()==authenticateduser.getUser().getId()) {
				parkInProcess(pl, car);
			}else {
				return null;
			}
		}else {
			parkInProcess(pl, car);
		}
		
		response.setCar(car);
		response.setParkingLot(pl);
		response.setSectorPlCount(pl.getSector().getFreePlCount());
		return response;
	}

	public Long deletePrakingLot(Long id) {
		
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		if(pl.getOccupyingCar()!=null) {
			parkOut(pl.getId());
		}
		System.out.println(id + " számú parkolóhely törölve!");
		plRepository.deleteById(id);
		return id;
	}
}
