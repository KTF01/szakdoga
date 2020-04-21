package hu.hkristof.parkingapp.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
@Entity
@Table(name = "parkingLots")
public class ParkingLot {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@NotBlank
	String name;
	
	@JsonIdentityReference(alwaysAsId = true)
	@OneToOne
	@JoinColumn(name= "plate_number")
	Car occupiingCar;
	
	@JsonIdentityReference(alwaysAsId = true)
	@ManyToOne
	Sector sector;

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

	public Car getOccupiingCar() {
		return occupiingCar;
	}

	public void setOccupiingCar(Car occupiingCar) {
		this.occupiingCar = occupiingCar;
	}

	public Sector getSector() {
		return sector;
	}

	public void setSector(Sector section) {
		this.sector = section;
	}

}
