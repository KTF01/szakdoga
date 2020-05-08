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
import org.mockito.invocation.InvocationOnMock;
import org.springframework.test.context.junit4.SpringRunner;

import hu.hkristof.parkingapp.exceptions.ParkHouseNotFoundException;
import hu.hkristof.parkingapp.exceptions.SectorNotFoundException;
import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.Sector;
import hu.hkristof.parkingapp.repositoris.ParkHouseRepository;
import hu.hkristof.parkingapp.repositoris.SectorRepository;
import hu.hkristof.parkingapp.responsetypes.AllParkHousesResponse;
import hu.hkristof.parkingapp.services.ParkHouseService;
import hu.hkristof.parkingapp.services.ParkingLotService;
import hu.hkristof.parkingapp.services.SectorService;

@RunWith(SpringRunner.class)
public class TestParkHouseService {
	
	@Mock
	ParkHouseRepository parkHouseReository;
	
	@InjectMocks
	ParkHouseService parkHouseService;
	
	@Mock
	SectorRepository sectorRepository;
	
	@Mock
	ParkingLotService parkingLotService;
	
	@InjectMocks
	SectorService sectorService;
	
	@Before
	public void init() {
		Mockito.when(parkHouseReository.save(Mockito.any(ParkHouse.class))).thenAnswer(
				(InvocationOnMock invocation)->{
					return invocation.getArgument(0);
				});
		
		ArrayList<ParkHouse> parkHouses = new ArrayList<>();
		ParkHouse ph1 = new ParkHouse(); ph1.setName("asd"); ph1.setId(1L);
		ParkHouse ph2 = new ParkHouse(); ph2.setName("fgh"); ph2.setId(2L);
		parkHouses.add(ph1);
		parkHouses.add(ph2);
		Sector sector1 = new Sector(); sector1.setId(1L);
		sector1.setName("B");
		Sector sector2 = new Sector(); sector2.setId(2L);
		sector2.setName("A");
		ph1.addSector(sector1);
		ph1.addSector(sector2);
		Mockito.when(parkHouseReository.findAllByOrderByNameAsc()).thenReturn(parkHouses);
		
		Mockito.when(parkHouseReository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
					for(ParkHouse ph : parkHouses) {
						if(ph.getId()==invocation.getArgument(0)) {
							return Optional.of(ph);
						}
					}
					throw new ParkHouseNotFoundException(invocation.getArgument(0));
				});
		
		Mockito.when(sectorRepository.findById(Mockito.anyLong())).then((InvocationOnMock invocation)->{
	;		for(Sector sec : ph1.getSectors()) {
				if(sec.getId()== invocation.getArgument(0)) {
					return Optional.of(sec);
				}
			}
			throw new SectorNotFoundException(invocation.getArgument(0));
		});
		
	}
	
	@Test
	public void testSaveparkHouse() {
		ParkHouse ph = new ParkHouse();
		ph.setName("PH1");
		ParkHouse created = parkHouseService.createParkHouse(ph);
		assertTrue(created.getName().equals(ph.getName()));
	}
	
	@Test
	public void testGetAllParkHouses() {
		AllParkHousesResponse mockResponse = parkHouseService.getAllParkhouses();
		assertTrue(mockResponse.getParkHouses().size()==2 && mockResponse.getCars().size()==0);
	}
	
	@Test
	public void testGetAllParkHousesSectorOrder() {
		AllParkHousesResponse mockResponse = parkHouseService.getAllParkhouses();
		assertTrue(mockResponse.getParkHouses().get(0).getSectors().get(0).getName()
				.compareTo(mockResponse.getParkHouses().get(0).getSectors().get(1).getName())==-1);
	}
	
	@Test
	public void testAddSectors() {
		ArrayList<Sector> newSectors = new ArrayList<>();
		newSectors.add(new Sector());
		newSectors.add(new Sector());
		ParkHouse ph = parkHouseService.addSectors(1L, newSectors);
		assertTrue(ph.getSectors().size()==4);
	}
	
	@Test(expected = ParkHouseNotFoundException.class)
	public void testDeleteParkHouseError() {
		parkHouseService.deleteParkHouse(3L);
	}
	
	@Test
	public void testDeleteSector() {
		assertTrue(sectorService.deleteSector(1L)==1L);
	}
	
	@Test(expected = SectorNotFoundException.class)
	public void testDeleteSectorError() {
		sectorService.deleteSector(3L);
	}
	
}
