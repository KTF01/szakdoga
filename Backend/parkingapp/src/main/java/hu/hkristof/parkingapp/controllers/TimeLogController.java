package hu.hkristof.parkingapp.controllers;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.LogAction;
import hu.hkristof.parkingapp.models.LogFilter;
import hu.hkristof.parkingapp.models.TimeLog;
import hu.hkristof.parkingapp.repositoris.TimeLogRepository;
import hu.hkristof.parkingapp.services.TimeLogService;

@CrossOrigin
@RestController
@RequestMapping("auth/logs")
public class TimeLogController {
	
	@Autowired
	TimeLogRepository timeLogRepository;
	
	@Autowired
	TimeLogService timeLogService;
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@GetMapping("/all")
	public ResponseEntity<List<TimeLog>> getAllLogs(){
		System.out.println("Logok lekérdezve!");
		return new ResponseEntity<>( timeLogRepository.findAllByOrderByTimeDescIdDesc(), HttpStatus.OK);
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@GetMapping("/filter")
	public ResponseEntity<List<TimeLog>> getFiltered(@RequestParam("userName") String userName, 
													@RequestParam("action") LogAction action,
													@RequestParam("startTime") String startTime,
													@RequestParam("endTime") String endTime){
		List<TimeLog> tls = timeLogService.filterLogs(userName, action, startTime, endTime);
		System.out.println(tls);
		return new ResponseEntity<>(tls,  HttpStatus.OK);
	}
}
