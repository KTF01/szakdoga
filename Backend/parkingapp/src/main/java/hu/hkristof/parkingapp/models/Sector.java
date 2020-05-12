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

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "sectors")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Sector {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank
	private String name;
	
	@NotNull
	private int floor;
	
	@NotNull
	@OneToMany(mappedBy = "sector", cascade = CascadeType.ALL)
	private List<ParkingLot> parkingLots;
	
	@ManyToOne
	private ParkHouse parkHouse;
	
	@Formula("(select count(p.id) from parking_lots p where p.plate_number is null and p.sector_id=id)")
	private int freePlCount;
	
	public Sector(){
		this.parkingLots = new ArrayList<>();
	}
	
	public void addParkingLot(ParkingLot parkingLot) {
		parkingLots.add(parkingLot);
		parkingLot.setSector(this);
    }
	
	public void removeParkingLot(ParkingLot parkingLot) {
		parkingLot.setSector(null);
		parkingLots.remove(parkingLot);
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

	public int getFreePlCount() {
		return freePlCount;
	}

	public void setFreePlCount(int freePlCount) {
		this.freePlCount = freePlCount;
	}
	
	public void increasePlCount() {
		this.freePlCount++;
	}
	public void decraseCount() {
		this.freePlCount--;
	}
	
}
