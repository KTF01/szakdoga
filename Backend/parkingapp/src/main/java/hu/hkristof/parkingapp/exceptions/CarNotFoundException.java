package hu.hkristof.parkingapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class CarNotFoundException extends RuntimeException{
	public CarNotFoundException(String plateNumber) {
		super(String.format("Autó %s rendszámmal nem található!", plateNumber));
	}
}
