package hu.hkristof.parkingapp.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.LogAction;
import hu.hkristof.parkingapp.Role;
import hu.hkristof.parkingapp.exceptions.CarNotFoundException;
import hu.hkristof.parkingapp.exceptions.ForbiddenOperationException;
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
		pl.getSector().getParkHouse().countParkingLots();
		response.setParkHouseFreePlCount(pl.getSector().getParkHouse().getFreePlCount());
		response.setParkHouseOccupiedPlCount(pl.getSector().getParkHouse().getOccupiedPlCount());
		return response;
	}
	
	private void parkoutProcess(ParkingLot pl) {
		Car car = pl.getOccupyingCar();
		car.setOccupiedParkingLot(null);
		carRepository.save(car);
		pl.setOccupyingCar(null);
		if(!pl.getIsReserved()) {
			pl.getSector().increasePlCount();
		}
		plRepository.save(pl);
		timeLogService.saveParkLog(LogAction.PARK_OUT,car, pl);
		System.out.println(pl.getName()+" parkolóból kiállt a "+ car.getPlateNumber()+" rendszámú autó!");
	}
	
	private void parkInProcess(ParkingLot pl, Car car) {
		if(car.getOccupiedParkingLot()!=null) {
			parkOut(car.getOccupiedParkingLot().getId());
		}
		pl.setOccupyingCar(car);
		if(!pl.getIsReserved()) {
			pl.getSector().decraseCount();
		}
		car.setOccupiedParkingLot(pl);
		plRepository.save(pl);
		carRepository.save(car);

		timeLogService.saveParkLog(LogAction.PARK_IN, car, pl);
		System.out.println("A "+ car.getPlateNumber()+" rendszámú autó beparkolt a "+ pl.getName()+" nevű parkolóhelyre.");
	}
	
	public ParkOutResponse parkOutSelf(Long id) {
		ParkOutResponse response = new ParkOutResponse();
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		if(pl.getOccupyingCar()!=null) {
			if(authenticateduser.getUser().getId()==pl.getOccupyingCar().getOwner().getId()) {
				parkoutProcess(pl);
			}else {
				throw new ForbiddenOperationException("NOT_OWNED_CAR");
			}
		}
		response.setParkingLot(pl);
		response.setFreePlCount(pl.getSector().getFreePlCount());
		return response;
	}
	
	//Beparkolást végrehajtó metódus. Csak akkor hajtja végre ha nem foglalt más által a parkoló, vagy a saját autóval próbálkokzik ha nem admin.
	public ParkInResponse parkIn(Long plId, String carPlate) {
		ParkInResponse response = new ParkInResponse();
		
		Long authID = authenticateduser.getUser().getId();
		
		ParkingLot pl = plRepository.findById(plId).orElseThrow(()->new ParkingLotNotFoundException(plId));
		Car car = carRepository.findById(carPlate).orElseThrow(()->new CarNotFoundException(carPlate));
		
		if(pl.getIsReserved()&&(pl.getReservation().getUser().getId()!=authID || car.getOwner().getId()!=authID)) {
			throw new ForbiddenOperationException("RESERVATION_BLOCK");
		}
		if(authenticateduser.getUser().getRole().equals(Role.ROLE_USER)&&car.getOwner().getId()!=authID) {
			throw new ForbiddenOperationException("NOT_OWNED_CAR");
		}
		parkInProcess(pl, car);
		if(pl.getIsReserved()) {
			response.setReservation(pl.getReservation());
		}
		
		response.setCar(car);
		response.setParkingLot(pl);
		response.setSectorPlCount(pl.getSector().getFreePlCount());
		pl.getSector().getParkHouse().countParkingLots();
		response.setParkHouseFreePlCount(pl.getSector().getParkHouse().getFreePlCount());
		response.setParkHouseOccupiedPlCount(pl.getSector().getParkHouse().getOccupiedPlCount());
		return response;
	}

	public Long deletePrakingLot(Long id) {
		
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		if(pl.getOccupyingCar()!=null) {
			parkOut(pl.getId());
		}else {
			pl.getSector().decraseCount();
			pl.getSector().getParkHouse().countParkingLots();
		}
		pl.getSector().removeParkingLot(pl);
		System.out.println(id + " számú parkolóhely törölve!");
		plRepository.delete(pl);
		return id;
	}
}
