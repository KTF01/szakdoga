package hu.hkristof.parkingapp.services;

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

	
	public ParkingLot parkOut(Long id) {
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		if(pl.getOccupiingCar()!=null) {
			parkoutProcess(pl);
		}
		return pl;
	}
	
	private void parkoutProcess(ParkingLot pl) {
		Car car = pl.getOccupiingCar();
		car.setOccupiedParkingLot(null);
		carRepository.save(car);
		pl.setOccupiingCar(null);
		plRepository.save(pl);
		timeLogService.saveLog(LogAction.PARK_OUT,car, pl);
		System.out.println(pl.getName()+" parkolóból kiállt a "+ car.getPlateNumber()+" rendszámú autó!");
	}
	
	private void parkInProcess(ParkingLot pl, Car car) {
		if(car.getOccupiedParkingLot()!=null) {
			parkOut(car.getOccupiedParkingLot().getId());
		}
		pl.setOccupiingCar(car);
		car.setOccupiedParkingLot(pl);
		plRepository.save(pl);
		carRepository.save(car);

		timeLogService.saveLog(LogAction.PARK_IN, car, pl);
		System.out.println("A "+ car.getPlateNumber()+" rendszámú autó beparkolt a "+ pl.getName()+" nevű parkolóhelyre.");
	}
	
	public ParkingLot parkOutSelf(Long id) {
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		if(pl.getOccupiingCar()!=null) {
			if(authenticateduser.getUser().getId()==pl.getOccupiingCar().getOwner().getId()) {
				parkoutProcess(pl);
			}else {
				return null;
			}
		}
		return pl;
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
		return response;
	}
}
