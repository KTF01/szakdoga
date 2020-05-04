package hu.hkristof.parkingapp.models;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "cars")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "plateNumber")
public class Car {
	
	@Id
	@NotBlank
	private String plateNumber;
	
	
	@ManyToOne(cascade = CascadeType.DETACH)
	private User owner;
	
	@OneToOne(cascade = CascadeType.PERSIST)
	private ParkingLot occupiedParkingLot;

	public ParkingLot getOccupiedParkingLot() {
		return occupiedParkingLot;
	}

	public void setOccupiedParkingLot(ParkingLot occupiedParkingLot) {
		this.occupiedParkingLot = occupiedParkingLot;
	}

	public String getPlateNumber() {
		return plateNumber;
	}

	public void setPlateNumber(String plateNumber) {
		this.plateNumber = plateNumber;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	

}
