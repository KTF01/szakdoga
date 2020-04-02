package hu.hkristof.parkingapp.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "sectors")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Sector {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@NotBlank
	String name;
	
	@NotNull
	int floor;
	
	@NotNull
	@OneToMany(mappedBy = "sector", cascade = CascadeType.ALL)
	List<ParkingLot> parkingLots;
	
	@NotNull
	@ManyToOne
	ParkHouse parkHouse;
	
	Sector(){
		this.parkingLots = new ArrayList<>();
	}
	public void addParkingLot(ParkingLot parkingLot) {
		parkingLots.add(parkingLot);
		parkingLot.setSector(this);
    }
	
	public ParkHouse getParkHouse() {
		return parkHouse;
	}

	public void setParkHouse(ParkHouse parkHouse) {
		this.parkHouse = parkHouse;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getFloor() {
		return floor;
	}

	public void setFloor(int floor) {
		this.floor = floor;
	}

	public List<ParkingLot> getParkingLots() {
		return parkingLots;
	}

	public void setParkingLots(List<ParkingLot> parkingLots) {
		this.parkingLots = parkingLots;
	}
	
	
}
