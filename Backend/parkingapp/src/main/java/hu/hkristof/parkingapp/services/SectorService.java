package hu.hkristof.parkingapp.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.exceptions.SectorNotFoundException;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Sector;
import hu.hkristof.parkingapp.repositoris.ParkingLotRepository;
import hu.hkristof.parkingapp.repositoris.SectorRepository;

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
	
	public Sector createSector(Sector sector) {
		Sector newSector = sectorRepository.save(sector);
		for(ParkingLot pl : sector.getParkingLots()) {
			pl.setSector(sector);
		}
		parkingLotRepository.saveAll(sector.getParkingLots());
		System.out.println(sector.getName()+" nevű szekció létrehozva!");
	    return newSector ;
	}
	
	public Sector addParkingLot(Long id, List<ParkingLot> newParkingLots) {
		Sector sector = sectorRepository.findById(id).orElseThrow(()->new SectorNotFoundException(id));
		for(ParkingLot parkingLot : newParkingLots) {
			sector.addParkingLot(parkingLot);
			sector.increasePlCount();
		}
		System.out.println(sector.getName()+" szekcióhoz parkolóhelyek lettek hozzáadva!");
		return sectorRepository.save(sector);
	}
	
	public Long deleteSector(Long id)
	{
		Sector sector = sectorRepository.findById(id).orElseThrow(()->new SectorNotFoundException(id));
		parkingLotService.massParkOut(sector.getParkingLots());
		sectorRepository.delete(sector);
		System.out.println(sector.getParkHouse().getName()+ " parkolóház "+ sector.getName()+" nevű szektora eltávolításra került.");
		return id;
	}
}