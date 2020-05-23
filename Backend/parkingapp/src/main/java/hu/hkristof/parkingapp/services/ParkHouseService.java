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
import hu.hkristof.parkingapp.models.Reservation;
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
	
	/**
	 * Az összes parkolóházat lekérdezi és a válaszban visszaadja őket és elvégzi a sorbarendezéseket.
	 * @return A válasz objektum ami tartalmazza magukat a parkolóházakat és a benne lévő autükat, foglalásokat.
	 */
	public AllParkHousesResponse getAllParkhouses() {
		AllParkHousesResponse response =  new AllParkHousesResponse();
		List<ParkHouse> parkHouses =  parkHouseRepository.findAllByOrderByNameAsc();
		List<Car> cars =  new ArrayList<>();
		List<Reservation> reservations = new ArrayList<>();
		
		for(ParkHouse ph : parkHouses) {
			for(Sector sector : ph.getSectors()) {
				sector.getParkingLots().sort(new Comparator<ParkingLot>() {
					@Override
					public int compare(ParkingLot o1, ParkingLot o2) {
				        return o1.getName().compareTo(o2.getName());
				    }
				});
				for(ParkingLot pl : sector.getParkingLots()) {
					if(pl.getOccupyingCar()!=null) {
						cars.add(pl.getOccupyingCar());
					}
					if(pl.getReservation()!=null) {
						reservations.add(pl.getReservation());
					}
				}
			}
			ph.getSectors().sort(new Comparator<Sector>() {
				@Override
				public int compare(Sector o1, Sector o2) {
					Integer i1 = o1.getFloor();
					Integer i2 = o2.getFloor();
					if(i1.equals(i2)) {
						return o1.getName().compareTo(o2.getName());
					}else {
						return i1.compareTo(i2);
					}
					
				}
			});;
		}
		System.out.println("Parkolóházak lekérdezve!");
		response.setParkHouses(parkHouses);
		response.setCars(cars);
		response.setReservations(reservations);
		return response;
	}
	
	public ParkHouse updateParkHouse(Long id, ParkHouse modifiedParkHouse) {
		ParkHouse editPH = parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		String oldName = editPH.getName();
		editPH.setAddress(modifiedParkHouse.getAddress());
		editPH.setName(modifiedParkHouse.getName());
		editPH.setNumberOfFloors(modifiedParkHouse.getNumberOfFloors());
		editPH.setLongitude(modifiedParkHouse.getLongitude());
		editPH.setLatitude(modifiedParkHouse.getLatitude());
		System.out.println(oldName +" nevű parkolóház módosítva lett! Új név: "+ editPH.getName());
		return parkHouseRepository.save(editPH);
	}
	
	public ParkHouse addSectors(Long id,List<Sector> newSectors) {
		ParkHouse ph =  parkHouseRepository.findById(id).orElseThrow(()->new ParkHouseNotFoundException(id));
		for(Sector sec : newSectors) {
			ph.addSector(sec);
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
