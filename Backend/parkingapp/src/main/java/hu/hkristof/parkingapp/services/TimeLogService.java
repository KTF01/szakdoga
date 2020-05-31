package hu.hkristof.parkingapp.services;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.BeanCreationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.LogAction;
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
	
	public List<TimeLog> getAllLogs(){
		System.out.println("Logok lekérdezve!");
		return timeLogRepository.findAllByOrderByTimeDescIdDesc();
	}
	
	private final String PARK_IN_SELF_TEXT = "%s beparkolt a %s rendszámú autójával a(z) %s parkolóhelyre.";
	private final String PARK_IN_OTHER_TEXT = "%s beparkolt a %s nevében %s rendszámú autóval a(z) %s parkolóhelyre.";
	private final String PARK_OUT_SELF_TEXT = "%s kiparkolt a %s rendszámú autójával a(z) %s parkolóhelyről.";
	private final String PARK_OUT_OTHER_TEXT = "%s kiparkolt a %s nevében %s rendszámú autóval a(z) %s parkolóhelyről.";
	
	/**
	 * Be és kiparkolással kapcsolatos bejegyzés mentése a naplóba. vagy ki- vagy beparkolás történt.
	 * Megvan különböztetve az az eset amikor egy felhasználó saját autójával áll be és az amikor
	 * egy adminisztrátor más nevében állbe.
	 * @param logAction PARK_IN vagy PARK_OUT, ellenkező esetben nem kerül mentésre a bejegyzés.
	 * @param car A beparkolt autó.
	 * @param pl A parkolóhely ahove bebarkoltak.
	 */
	public void saveParkLog(LogAction logAction, Car car,ParkingLot pl) {
		TimeLog timeLog = new TimeLog();
		timeLog.setAction(logAction);
		timeLog.setUserName(authenticatedUser.getUser().getFirstName()+" "+ authenticatedUser.getUser().getLastName());
		timeLog.setTime(new Timestamp(System.currentTimeMillis()));
		pl.getSector().getParkHouse().countParkingLots();
		timeLog.setParkHouseId(pl.getSector().getParkHouse().getId());
		timeLog.setParkHouseFreePlCount(pl.getSector().getParkHouse().getFreePlCount());
		timeLog.setParkHouseOccupiedPlCount(pl.getSector().getParkHouse().getOccupiedPlCount());
		String parkingLotPath = pl.getSector().getParkHouse().getName()+'/'+pl.getSector().getName()+'/'+pl.getName();
		if(logAction.equals(LogAction.PARK_IN)) {
			if(authenticatedUser.getUser().getId()==car.getOwner().getId()) {
				timeLog.setMessage(String.format(PARK_IN_SELF_TEXT, 
						timeLog.getUserName(), car.getPlateNumber(), parkingLotPath));
			}else {
				timeLog.setMessage(String.format(PARK_IN_OTHER_TEXT, 
						timeLog.getUserName(), car.getOwner().getFirstName()+' '+car.getOwner().getLastName(),
						car.getPlateNumber(), parkingLotPath));
			}
			
		}else if(logAction.equals(LogAction.PARK_OUT)) {
			if(authenticatedUser.getUser().getId()==car.getOwner().getId()) {
				timeLog.setMessage(String.format(PARK_OUT_SELF_TEXT, 
						timeLog.getUserName(), car.getPlateNumber(), parkingLotPath));
			}else {
				timeLog.setMessage(String.format(PARK_OUT_OTHER_TEXT, 
						timeLog.getUserName(), car.getOwner().getFirstName()+' '+car.getOwner().getLastName(),
						car.getPlateNumber(), parkingLotPath));
			}
		}else {return;}
		timeLogRepository.save(timeLog);
	}

	//Regisztráció lementése
	public void saveSignUpLog(User user) {
		TimeLog timeLog = new TimeLog();
		timeLog.setAction(LogAction.USER_SIGN_UP);
		timeLog.setUserName(user.getFirstName()+" "+user.getLastName());
		timeLog.setMessage(timeLog.getUserName()+" beregisztrált "+ user.getEmail()+" emailcímmel.");
		timeLog.setTime(new Timestamp(System.currentTimeMillis()));
		timeLogRepository.save(timeLog);
	}
	
	/**
	 * Foglalást jegyző naplóbejegyzés mentése.
	 * @param pl A parkoló amelyik le lett foglalva.
	 */
	public void saveReserveLog(ParkingLot pl) {
		TimeLog timeLog = new TimeLog();
		timeLog.setAction(LogAction.RESERVE_MAKE);
		timeLog.setUserName(authenticatedUser.getUser().getFirstName()+" "+ authenticatedUser.getUser().getLastName());
		pl.getSector().getParkHouse().countParkingLots();
		timeLog.setParkHouseId(pl.getSector().getParkHouse().getId());
		timeLog.setParkHouseFreePlCount(pl.getSector().getParkHouse().getFreePlCount());
		timeLog.setParkHouseOccupiedPlCount(pl.getSector().getParkHouse().getOccupiedPlCount());
		timeLog.setMessage(String.format("%s lefoglalta a %s parkolóház %s szektorában a %s parkolóhelyet",
				timeLog.getUserName(),
				pl.getSector().getParkHouse().getName(),
				pl.getSector().getName(),
				pl.getName()));
		timeLog.setTime(new Timestamp(System.currentTimeMillis()));
		timeLogRepository.save(timeLog);
	}
	
	/**
	 * Foglalást törlő naplóbejegyzés
	 * @param pl A parkoló amiről törölték a foglalást.
	 */
	public void saveReserveDeleteLog(ParkingLot pl) {
		TimeLog timeLog = new TimeLog();
		timeLog.setAction(LogAction.RESERVE_DELETE);
		try {
			timeLog.setUserName(authenticatedUser.getUser().getFirstName()+" "+ authenticatedUser.getUser().getLastName());
			timeLog.setMessage(String.format("%s törölte a %s parkolóhelyre vonatkozó foglalását.",
					timeLog.getUserName(),
					pl.getSector().getParkHouse().getName()+"/"+
					pl.getSector().getName()+"/"+
					pl.getName()));
		}catch(BeanCreationException ex) { //Nincs autentikált user, tehát nem requestben vagyun azaz a scheduler hívta meg a függvényt.
			timeLog.setUserName("Rendszer");
			timeLog.setMessage(String.format("A %s parkolóhelyre vonatkozó foglalás lejárt és a rendszer törölte.",
					pl.getSector().getParkHouse().getName()+"/"+
					pl.getSector().getName()+"/"+
					pl.getName()
				)
			);
		}
		pl.getSector().getParkHouse().countParkingLots();
		timeLog.setParkHouseId(pl.getSector().getParkHouse().getId());
		timeLog.setParkHouseFreePlCount(pl.getSector().getParkHouse().getFreePlCount());
		timeLog.setParkHouseOccupiedPlCount(pl.getSector().getParkHouse().getOccupiedPlCount());
		timeLog.setTime(new Timestamp(System.currentTimeMillis()));
		timeLogRepository.save(timeLog);
	}
	
	//Naplóbejegyzések közötti keresés.
	public List<TimeLog> filterLogs(String text, LogAction action, String startTime, String endTime) {
		String actionString = action.equals(LogAction.ALL)?"": action.toString();
		System.out.println("Logok szűrése ||| "+text+" | "+action+" | "+startTime+" | "+endTime);
		return timeLogRepository.findByFilter(text, actionString, startTime, endTime);
	}
	
	
}
