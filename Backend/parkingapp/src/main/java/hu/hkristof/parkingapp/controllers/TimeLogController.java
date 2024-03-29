package hu.hkristof.parkingapp.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.models.LogAction;
import hu.hkristof.parkingapp.models.TimeLog;
import hu.hkristof.parkingapp.services.TimeLogService;

@CrossOrigin
@RestController
@RequestMapping("auth/logs")
public class TimeLogController {
	
	@Autowired
	TimeLogService timeLogService;
	
	/**
	 * Összes naplóbejegyzés lekérdezése. Csak adminisztrátorok férnek hozzá a végponthoz.
	 * @return A TimeLog-ok listája ami tartalmazza az összes naplóbejegyzést az adatbázisban.
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@GetMapping("/all")
	public ResponseEntity<List<TimeLog>> getAllLogs(){
		return new ResponseEntity<>( timeLogService.getAllLogs(), HttpStatus.OK);
	}
	
	/**
	 * Bizonyos paraméterek szerint szűrt naplóbejegyzések listája.
	 * @param text A bejegyzésben keresendő szöveg.
	 * @param action A bejegyzés típus, hogy mijen művelet hatására keletkezett.
	 * @param startTime A szűrt időintervallum kezdete.
	 * @param endTime A szűrt indőintervallum vége.
	 * @return Naplóbejegyzések listája.
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@GetMapping("/filter")
	public ResponseEntity<List<TimeLog>> getFiltered(@RequestParam("userName") String text, 
													@RequestParam("action") LogAction action,
													@RequestParam("startTime") String startTime,
													@RequestParam("endTime") String endTime){
		List<TimeLog> tls = timeLogService.filterLogs(text, action, startTime, endTime);
		System.out.println(tls);
		return new ResponseEntity<>(tls,  HttpStatus.OK);
	}
}
