package hu.hkristof.parkingapp.unit;

import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.Sector;

public class TestSector {
	
	Sector sector;
	
	@Before
	public void init() {
		sector = new Sector();
	}
	
	@Test
	public void testAddSector() {
		ParkingLot pl = new ParkingLot();
		pl.setName("P1");
		sector.addParkingLot(pl);
		assertTrue(sector.getParkingLots().contains(pl) && pl.getSector().equals(sector));
	}
}
