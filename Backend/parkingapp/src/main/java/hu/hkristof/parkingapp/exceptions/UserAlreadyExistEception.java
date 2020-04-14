package hu.hkristof.parkingapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class UserAlreadyExistEception extends RuntimeException{
	public UserAlreadyExistEception(String email) {
		super(String.format("%s email cím már foglalat!", email));
	}
}
