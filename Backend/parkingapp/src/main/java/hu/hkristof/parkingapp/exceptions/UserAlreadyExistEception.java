package hu.hkristof.parkingapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class UserAlreadyExistEception extends RuntimeException{
	public UserAlreadyExistEception(String username) {
		super(String.format("%s nevű felhasználó már létezik!", username));
	}
}
