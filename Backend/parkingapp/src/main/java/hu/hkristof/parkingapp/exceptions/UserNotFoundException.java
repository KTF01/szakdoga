package hu.hkristof.parkingapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException{
	public UserNotFoundException(String userName) {
		super(String.format("%s nevű felhasználó nem található!", userName));
	}
}
