package hu.hkristof.parkingapp.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.PostLoad;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "parkHouses")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ParkHouse {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank
	private String name;
	
	private String address;
	
	@NotNull
	@Column(columnDefinition = "integer default 0")
	private int firstFloor;
	
	@NotNull
	@PositiveOrZero
	private int numberOfFloors;
	
	@NotNull
	@OneToMany(mappedBy = "parkHouse", cascade = CascadeType.ALL)
	private List<Sector> sectors;
	
	private int freePlCount;
	
	private int occupiedPlCount;
	
	@NotNull
	private double longitude;
	
	@NotNull
	private double latitude;
	
	@PostLoad
	public void countParkingLots() {
		freePlCount = 0;
		int allPlCount=0;
		for (Sector sector : sectors) {
			freePlCount+=sector.getFreePlCount();
			allPlCount+=sector.getParkingLots().size();
		}
		occupiedPlCount = allPlCount-freePlCount;
	}
	
	public ParkHouse(){
		this.sectors = new ArrayList<>();
	}
	
	public void addSector(Sector sector) {
		sectors.add(sector);
        sector.setParkHouse(this);
    }
 
    public void removeSector(Sector sector) {
        sector.setParkHouse(null);
        this.sectors.remove(sector);
        this.countParkingLots();
    }
	
	
	public List<Sector> getSectors() {
		return sectors;
	}

	public void setSectors(List<Sector> sector) {
		this.sectors = sector;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getNumberOfFloors() {
		return numberOfFloors;
	}

	public void setNumberOfFloors(int numberOfFloors) {
		this.numberOfFloors = numberOfFloors;
	}

	public int getFreePlCount() {
		return freePlCount;
	}

	public void setFreePlCount(int freePlCount) {
		this.freePlCount = freePlCount;
	}
	
	public int getOccupiedPlCount() {
		return occupiedPlCount;
	}

	public void setOccupiedPlCount(int occupiedPlCount) {
		this.occupiedPlCount = occupiedPlCount;
	}

	public int getFirstFloor() {
		return firstFloor;
	}

	public void setFirstFloor(int firstFloor) {
		this.firstFloor = firstFloor;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	
}
