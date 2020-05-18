package hu.hkristof.parkingapp.models;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import hu.hkristof.parkingapp.LogAction;

@Entity
@Table(name = "time_logs")
public class TimeLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotNull
	private Timestamp time;
	
	@NotNull
	@Enumerated(EnumType.STRING)
	private LogAction action;
	
	@NotBlank
	private String userName;
	
	@NotBlank
	private String message;
	
	private Long parkHouseId;
	
	private String parkHouseName;
	
	private int parkHouseFreePlCount;
	
	private int parkHouseOccupiedPlCount;

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

	public LogAction getAction() {
		return action;
	}

	public void setAction(LogAction action) {
		this.action = action;
	}
	
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Long getParkHouseId() {
		return parkHouseId;
	}

	public void setParkHouseId(Long parkHouseId) {
		this.parkHouseId = parkHouseId;
	}

	public String getParkHouseName() {
		return parkHouseName;
	}

	public void setParkHouseName(String parkHouseName) {
		this.parkHouseName = parkHouseName;
	}

	public int getParkHouseFreePlCount() {
		return parkHouseFreePlCount;
	}

	public void setParkHouseFreePlCount(int parkHouseFreePlCount) {
		this.parkHouseFreePlCount = parkHouseFreePlCount;
	}

	public int getParkHouseOccupiedPlCount() {
		return parkHouseOccupiedPlCount;
	}

	public void setParkHouseOccupiedPlCount(int parkHouseOccupiedPlCount) {
		this.parkHouseOccupiedPlCount = parkHouseOccupiedPlCount;
	}
	
}
