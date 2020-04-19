package hu.hkristof.parkingapp.services;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.LogAction;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkingLot;
import hu.hkristof.parkingapp.models.TimeLog;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.TimeLogRepository;

@Service
public class TimeLogService {
	@Autowired
	TimeLogRepository timeLogRepository;
	
	@Autowired 
	private AuthenticatedUser authenticatedUser;
	
	public void saveLog(LogAction logAction, Car car,ParkingLot pl) {
		TimeLog timeLog = new TimeLog();
		timeLog.setAction(logAction);
		timeLog.setUserName(authenticatedUser.getUser().getFirstName()+" "+ authenticatedUser.getUser().getLastName());
		timeLog.setCarOwnerName(car.getOwner().getFirstName()+' '+ car.getOwner().getLastName());
		timeLog.setTime(new Timestamp(System.currentTimeMillis()));
		timeLog.setPlateNumber(car.getPlateNumber());
		timeLog.setParkingLotName(pl.getName());
		timeLog.setSectorName(pl.getSector().getName());
		timeLog.setParkHouseName(pl.getSector().getParkHouse().getName());
		if(logAction.equals(LogAction.PARK_IN)) {
			if(authenticatedUser.getUser().getId()==car.getOwner().getId()) {
				timeLog.setMessage(String.format("%s beparkolt a %s rendszámú autójával a(z) %s parkolóhelyre.", 
						timeLog.getUserName(), timeLog.getPlateNumber(), timeLog.getParkingLotName()));
			}else {
				timeLog.setMessage(String.format("%s beparkolt a %s nevében %s rendszámú autóval a(z) %s parkolóhelyre.", 
						timeLog.getUserName(), timeLog.getCarOwnerName(),timeLog.getPlateNumber(), timeLog.getParkingLotName()));
			}
			
		}else if(logAction.equals(LogAction.PARK_OUT)) {
			if(authenticatedUser.getUser().getId()==car.getOwner().getId()) {
				timeLog.setMessage(String.format("%s kiparkolt a %s rendszámú autójával a(z) %s parkolóhelyről.", 
						timeLog.getUserName(), timeLog.getPlateNumber(), timeLog.getParkingLotName()));
			}else {
				timeLog.setMessage(String.format("%s kiparkolt a %s nevében %s rendszámú autóval a(z) %s parkolóhelyről.", 
						timeLog.getUserName(), timeLog.getCarOwnerName(),timeLog.getPlateNumber(), timeLog.getParkingLotName()));
			}
		}
		timeLogRepository.save(timeLog);
	}

	public void saveSignUpLog(User user) {
		TimeLog timeLog = new TimeLog();
		timeLog.setAction(LogAction.USER_SIGN_UP);
		timeLog.setUserName(user.getFirstName()+" "+user.getLastName());
		timeLog.setMessage(timeLog.getUserName()+" beregisztrált "+ user.getEmail()+" emailcímmel.");
		timeLog.setTime(new Timestamp(System.currentTimeMillis()));
		timeLogRepository.save(timeLog);
	}
	
	public List<TimeLog> filterLogs(String userName, LogAction action, String startTime, String endTime) {
		String actionString = action.equals(LogAction.ALL)?"": action.toString();
		System.out.println("EZEZEZE: "+actionString);
		System.out.println("Filteres lekérdezés ||| "+userName+" | "+action+" | "+startTime+" | "+endTime);
		return timeLogRepository.findByFilter(userName, actionString, startTime, endTime);
	}
	
	
}
