package hu.hkristof.parkingapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ReservationNotFoundException extends RuntimeException{
	public ReservationNotFoundException(Long resourceId) {
		super(String.format("Foglalás %d id-val nem található!", resourceId));
	}
}
