package hu.hkristof.parkingapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Üzleti logikából adódóan helytelen művelet végrehajtásakor keletkező kivétel.
 * Eldobásakor 409-es hibakóddal küld a szerver választ a request-re.
 * @author krist
 *
 */
@SuppressWarnings("serial")
@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class ForbiddenOperationException extends RuntimeException{
	public ForbiddenOperationException(String message) {
		super(message);
	}
}
