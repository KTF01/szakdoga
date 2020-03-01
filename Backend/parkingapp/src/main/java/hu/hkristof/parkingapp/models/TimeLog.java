package hu.hkristof.parkingapp.models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "time_logs")
public class TimeLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@NotNull
	Timestamp time;
	
	@NotNull
	Boolean isParkedIn;
	
	@NotNull
	@OneToOne
	Car car;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Timestamp getTime() {
		return time;
	}

	public void setTime(Timestamp time) {
		this.time = time;
	}

	public Boolean getIsParkedIn() {
		return isParkedIn;
	}

	public void setIsParkedIn(Boolean isParkedIn) {
		this.isParkedIn = isParkedIn;
	}

	public Car getCar() {
		return car;
	}

	public void setCar(Car car) {
		this.car = car;
	}
	
	
}
