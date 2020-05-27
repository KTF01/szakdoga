package hu.hkristof.parkingapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ParkHouseNotFoundException extends RuntimeException{
	public ParkHouseNotFoundException(Long id) {
		super(String.format("%d id-vel rendelkező parkolóház nem található!", id));
	}
}
