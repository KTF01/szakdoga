package hu.hkristof.parkingapp.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.exceptions.SectorNotFoundException;
import hu.hkristof.parkingapp.models.ParkHouse;
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
	public Sector addParkingLot(Long id, List<ParkingLot> newParkingLots) {
		Sector sector = sectorRepository.findById(id).orElseThrow(()->new SectorNotFoundException(id));
		for(ParkingLot parkingLot : newParkingLots) {
			sector.addParkingLot(parkingLot);
			sector.increasePlCount();
		}
		sector.getParkHouse().countPls();
		System.out.println(sector.getName()+" szekcióhoz parkolóhelyek lettek hozzáadva!");
		return sectorRepository.save(sector);
	}
	
	public Long deleteSector(Long id)
	{
		Sector sector = sectorRepository.findById(id).orElseThrow(()->new SectorNotFoundException(id));
		parkingLotService.massParkOut(sector.getParkingLots());
		ParkHouse ph = sector.getParkHouse();
		ph.removeSector(sector);
		sectorRepository.delete(sector);
		System.out.println(ph.getName()+ " parkolóház "+ sector.getName()+" nevű szektora eltávolításra került.");
		return id;
	}
}
