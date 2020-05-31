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

@Entity
@Table(name = "time_logs")
public class TimeLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotNull
	private Timestamp time;
	
	//Mentett akció fajtája.
	@NotNull
	@Enumerated(EnumType.STRING)
	private LogAction action;
	
	//Felhasználó neve aki kiváltotta az akciót.
	@NotBlank
	private String userName;
	
	//Bejegyzés szövege
	@NotBlank
	private String message;
	
	//A parkolóház azonosítója amiben a mentett akció végrehajtódott. (Amenyyiben nem regisztáció történ, akkor ez a mezó null)
	private Long parkHouseId;
	//A parkolóházban lévő szabad parkolóhelyek száma az akció végbemenetele után.
	private int parkHouseFreePlCount;
	//A parkolóházban lévő foglalt parkolóhelyek száma az akció végbemenetele után.
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
