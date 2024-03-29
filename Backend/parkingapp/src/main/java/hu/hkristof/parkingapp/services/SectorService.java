package hu.hkristof.parkingapp.services;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.exceptions.SectorNotFoundException;
import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Sector;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;
import hu.hkristof.parkingapp.repositoris.SectorRepository;
import hu.hkristof.parkingapp.responsetypes.DeleteSectorResponse;

@Service
public class SectorService {
	
	@Autowired
	SectorRepository sectorRepository;
	
	@Autowired
	ParkingLotService parkingLotService;
	
	@Autowired
	ParkingLotRepository parkingLotRepository;
	
	public List<Sector> getAll(){
		return sectorRepository.findAll();
	}
	/**
	 * Parkolók hozzáadása egy szektorhoz.
	 */
	public Sector addParkingLot(Long id, List<ParkingLot> newParkingLots) {
		Sector sector = sectorRepository.findById(id).orElseThrow(()->new SectorNotFoundException(id));
		for(ParkingLot parkingLot : newParkingLots) {
			sector.addParkingLot(parkingLot);
			sector.increasePlCount();
		}
		sector.getParkHouse().countParkingLots();
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+sector.getName()+" szekcióhoz parkolóhelyek lettek hozzáadva!");
		return sectorRepository.save(sector);
	}
	/**
	 * Sector törlése
	 * @param id Törlendő szektor azonosítója.
	 * @return DeleteSectorRespone objektum ami tartalmazza a parkolóház-ban lévő parkolók számát a törlés után.
	 */
	public DeleteSectorResponse deleteSector(Long id)
	{
		DeleteSectorResponse response = new DeleteSectorResponse();
		Sector sector = sectorRepository.findById(id).orElseThrow(()->new SectorNotFoundException(id));
		parkingLotService.massParkOut(sector.getParkingLots());
		ParkHouse ph = sector.getParkHouse();
		ph.removeSector(sector);
		sectorRepository.delete(sector);
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+ph.getName()+ " parkolóház "+ sector.getName()+" nevű szektora eltávolításra került.");
		response.setDeletedId(id);
		response.setParkHouseFreeplCount(ph.getFreePlCount());
		response.setParkHouseOccupiedPlCount(ph.getOccupiedPlCount());
		return response;
	}
}
