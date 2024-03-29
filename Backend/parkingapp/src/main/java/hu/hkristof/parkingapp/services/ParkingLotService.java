package hu.hkristof.parkingapp.services;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.exceptions.CarNotFoundException;
import hu.hkristof.parkingapp.exceptions.ForbiddenOperationException;
import hu.hkristof.parkingapp.exceptions.ParkingLotNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.LogAction;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Role;
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
	AuthenticatedUser authenticatedUser;

	/**
	 * Több parkoló egyszerre történő kiparkolása.
	 * @param parkingLots
	 */
	@Transactional
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
	
	/**
	 * Autó kiparkolása egy parkolóhelyről
	 * @param id Az autó azonosítója.
	 * @return
	 */
	public ParkOutResponse parkOut(Long id) {
		ParkOutResponse response = new ParkOutResponse();
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		
		if(pl.getOccupyingCar()!=null) {
			
			boolean isNormalUser = authenticatedUser.getUser().getRole().equals(Role.ROLE_USER);
			boolean isSelfCar=authenticatedUser.getUser().getId()==pl.getOccupyingCar().getOwner().getId();
			if(!isNormalUser || isNormalUser && isSelfCar) {
				parkoutProcess(pl);
			}else {
				throw new ForbiddenOperationException("NOT_ADMIN_OR_NOT_SELF_CAR");
			}
			
		}else {
			throw new ForbiddenOperationException("NO_CAR_IN_PARKINGLOT");
		}
		response.setParkingLot(pl);
		response.setFreePlCount(pl.getSector().getFreePlCount());
		pl.getSector().getParkHouse().countParkingLots();
		response.setParkHouseFreePlCount(pl.getSector().getParkHouse().getFreePlCount());
		response.setParkHouseOccupiedPlCount(pl.getSector().getParkHouse().getOccupiedPlCount());
		return response;
	}
	
	//A közvetlenül az adatbázisban végbemenő változások végrehajtása kiparkolás esetén.
	//Frissíti az autó occupied_parking_lot mezőjét, frissíti a parkolóhelyet, és elment egy naplóbejegyzést 
	@Transactional
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
	
	//Adatbázisba menti a beparkolási művelet következtében létrejövő változtatásokat.
	@Transactional
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

	
	/**
	 * Beparkolást végrehajtó metódus. Csak akkor hajtja végre ha nem foglalt más által a parkoló,
	 * vagy a saját autóval próbálkokzik ha nem admin.
	 * @param plId A parkoló azonosítója ahova a beparkolás fog történni
	 * @param carPlate Az autó rendszáma amivel beparkol a felhasználó.
	 * @return ParkInRespons objektum amit visszaküldünk a kliensnek.
	 */
	@Transactional
	public ParkInResponse parkIn(Long plId, String carPlate) {
		ParkInResponse response = new ParkInResponse();
		
		Long authID = authenticatedUser.getUser().getId();
		
		ParkingLot pl = plRepository.findById(plId).orElseThrow(()->new ParkingLotNotFoundException(plId));
		Car car = carRepository.findById(carPlate).orElseThrow(()->new CarNotFoundException(carPlate));
		
		if(pl.getIsReserved()&&(pl.getReservation().getUser().getId()!=authID || car.getOwner().getId()!=authID)) {
			throw new ForbiddenOperationException("RESERVATION_BLOCK");
		}
		if(authenticatedUser.getUser().getRole().equals(Role.ROLE_USER)&&car.getOwner().getId()!=authID) {
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

	/**
	 * Parkolóhely kitörlése. Haáll benne autó azt előbb kiparkoltatjuk, frissítjük a parkolóházban lévő parkolók számát.
	 * @param id Törölni kívánt parkoló azonosítója.
	 * @return A törölt parkoló azonosítója
	 */
	public Long deletePrakingLot(Long id) {
		
		ParkingLot pl = plRepository.findById(id).orElseThrow(()->new ParkingLotNotFoundException(id));
		if(pl.getOccupyingCar()!=null) {
			parkOut(pl.getId());
		}else {
			pl.getSector().decraseCount();
			pl.getSector().getParkHouse().countParkingLots();
		}
		pl.getSector().removeParkingLot(pl);
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+id + " számú parkolóhely törölve!");
		plRepository.delete(pl);
		return id;
	}
}
