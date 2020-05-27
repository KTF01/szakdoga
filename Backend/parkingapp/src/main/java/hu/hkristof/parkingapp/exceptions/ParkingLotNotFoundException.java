package hu.hkristof.parkingapp.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ParkingLotNotFoundException extends RuntimeException {

	public ParkingLotNotFoundException(Long resourceId) {
		super(String.format("Parkolóhely %d id-vel nem található!", resourceId));
	}
}
