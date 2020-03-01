package hu.hkristof.parkingapp.models;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "parkingLots")
public class ParkingLot {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@NotBlank
	String name;
	
	@OneToOne(cascade = CascadeType.DETACH)
	@JoinColumn(name= "plate_number")
	Car occupiingCar;
	
	@ManyToOne
	Section section;

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

	public Section getSection() {
		return section;
	}

	public void setSection(Section section) {
		this.section = section;
	}

}
