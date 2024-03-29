package hu.hkristof.parkingapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class SectorNotFoundException extends RuntimeException{
	public SectorNotFoundException(Long resourceId) {
		super(String.format("Szektor %d id-val nem található!", resourceId));
	}
}
