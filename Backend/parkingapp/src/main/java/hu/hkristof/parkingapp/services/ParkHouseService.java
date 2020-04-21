package hu.hkristof.parkingapp.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.exceptions.ParkHouseNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Sector;
import hu.hkristof.parkingapp.repositoris.ParkHouseRepository;
import hu.hkristof.parkingapp.responsetypes.AllParkHousesResponse;

@Service
public class ParkHouseService {
	
	@Autowired
	ParkHouseRepository parkHouseRepository;
	
	@Autowired
	ParkingLotService parkingLotService;
	
	public ParkHouse createParkHouse(ParkHouse ph) {
		System.out.println(ph.getName()+" nevű parkolóház létrehozva!");
	    return parkHouseRepository.save(ph);
	}
	
	public AllParkHousesResponse getAllParkhouses() {
		AllParkHousesResponse response =  new AllParkHousesResponse();
		List<ParkHouse> parkHouses =  parkHouseRepository.findAll();
		List<Car> cars =  new ArrayList<>();
		
		for(ParkHouse ph : parkHouses) {
			for(Sector sector : ph.getSectors()) {
				sector.getParkingLots().sort(new Comparator<ParkingLot>() {
					public int compare(ParkingLot obj1, ParkingLot obj2) {
				        return obj1.getName().compareTo(obj2.getName());
				    }
				});
				for(ParkingLot pl : sector.getParkingLots()) {
					if(pl.getOccupiingCar()!=null) {
						cars.add(pl.getOccupiingCar());
					}
				}
			}
		}
		System.out.println("Parkolóházak lekérdezve!");
		response.setParkHouses(parkHouses);
		response.setCars(cars);
		return response;
	}
	
	public ParkHouse updateParkHouse(Long id, ParkHouse modifiedParkHouse) {
		ParkHouse editPH = parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		String oldName = editPH.getName();
		editPH.setAddress(modifiedParkHouse.getAddress());
		editPH.setName(modifiedParkHouse.getName());
		editPH.setNumberOfFloors(modifiedParkHouse.getNumberOfFloors());
		System.out.println(oldName +" nevű parkolóház módosítva lett! Új név: "+ editPH.getName());
		return parkHouseRepository.save(editPH);
	}
	
	public ParkHouse addSectors(Long id,List<Sector> newSectors) {
		ParkHouse ph =  parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		for(Sector sec : newSectors) {
			ph.addSection(sec);
		}
		System.out.println(ph.getName()+" parkolóházhoz szektorok lettek hozzáadva!");
		return parkHouseRepository.save(ph);
	}
	
	public Long deleteParkHouse(Long id) {
		ParkHouse parkHouse = parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		parkOutAllCars(parkHouse);
		System.out.println(parkHouse.getName()+" nevű parkolóház törölve!");
		parkHouseRepository.delete(parkHouse);
		return id;
	}
	
	private void parkOutAllCars(ParkHouse parkHouse) {
		ArrayList<ParkingLot> allParkingLots = new ArrayList<ParkingLot>();
		for(Sector sector: parkHouse.getSectors()) {
			allParkingLots.addAll(sector.getParkingLots());
		}
		parkingLotService.massParkOut(allParkingLots);
	}
	
}
