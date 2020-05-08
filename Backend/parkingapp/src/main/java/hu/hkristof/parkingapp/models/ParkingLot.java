package hu.hkristof.parkingapp.models;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIdentityReference;

import hu.hkristof.parkingapp.ParkingLotStatus;
@Entity
@Table(name = "parkingLots")
public class ParkingLot {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank
	private String name;
	
	@NotNull
	@Enumerated(EnumType.STRING)
	private ParkingLotStatus status;
	
	@JsonIdentityReference(alwaysAsId = true)
	@OneToOne
	private Reservation reservation;
	
	@JsonIdentityReference(alwaysAsId = true)
	@OneToOne
	@JoinColumn(name= "plate_number")
	private Car occupyingCar;
	
	@JsonIdentityReference(alwaysAsId = true)
	@ManyToOne
	private Sector sector;

	public ParkingLot() {
		status = ParkingLotStatus.EMPTY;
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

	public Car getOccupyingCar() {
		return occupyingCar;
	}

	public void setOccupyingCar(Car occupiingCar) {
		this.occupyingCar = occupiingCar;
	}

	public Sector getSector() {
		return sector;
	}

	public void setSector(Sector sector) {
		this.sector = sector;
	}

	public ParkingLotStatus getStatus() {
		return status;
	}

	public void setStatus(ParkingLotStatus status) {
		this.status = status;
	}

	public Reservation getReservation() {
		return reservation;
	}

	public void setReservation(Reservation reservation) {
		this.reservation = reservation;
	}

}
