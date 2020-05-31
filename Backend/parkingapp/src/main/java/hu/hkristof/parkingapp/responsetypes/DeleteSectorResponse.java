package hu.hkristof.parkingapp.responsetypes;
/**
 * Szektor törlésének kérésére küldendő válasz típusa.
 * @author krist
 *
 */
public class DeleteSectorResponse {
	private Long deletedId;
	//Beletesszük a törlés utáni számokat, hogy könyebb legyen frissíteni a frontenden.
	private int parkHouseFreeplCount;
	private int parkHouseOccupiedPlCount;
	public Long getDeletedId() {
		return deletedId;
	}
	public void setDeletedId(Long deletedId) {
		this.deletedId = deletedId;
	}
	public int getParkHouseFreeplCount() {
		return parkHouseFreeplCount;
	}
	public void setParkHouseFreeplCount(int parkHouseFreeplCount) {
		this.parkHouseFreeplCount = parkHouseFreeplCount;
	}
	public int getParkHouseOccupiedPlCount() {
		return parkHouseOccupiedPlCount;
	}
	public void setParkHouseOccupiedPlCount(int parkHouseOccupiedPlCount) {
		this.parkHouseOccupiedPlCount = parkHouseOccupiedPlCount;
	}
}
