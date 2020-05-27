package hu.hkristof.parkingapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class ForbiddenOperationException extends RuntimeException{
	public ForbiddenOperationException(String message) {
		super(message);
	}
}
