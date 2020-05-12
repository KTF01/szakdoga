package hu.hkristof.parkingapp.unit;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.Sector;

public class TestHouseUnit {

	ParkHouse parkHouse;
	
	@Before
	public void init() {
		parkHouse = new ParkHouse();
		Sector sector = new Sector();
		sector.setName("Sector 1");
		sector.setFreePlCount(2);
		Sector sector2 = new Sector();
		sector2.setName("Sector 2");
		sector2.setFreePlCount(3);
		parkHouse.addSector(sector);
		parkHouse.addSector(sector2);
	}
	
	@Test
	public void testFreePlCount() {
		parkHouse.countPls();
		assertTrue(parkHouse.getFreePlCount()==5);
	}
	
	@Test
	public void testAddSector() {
		Sector sector = new Sector();
		sector.setName("Sector 3");
		parkHouse.addSector(sector);
		assertTrue(parkHouse.getSectors().contains(sector));
	}
	
	@Test
	public void testRemoveSector() {
		Sector sector = parkHouse.getSectors().get(0);
		parkHouse.removeSector(sector);
		assertFalse(parkHouse.getSectors().contains(sector));
	}
}
