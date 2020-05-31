package hu.hkristof.parkingapp.services;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.exceptions.ForbiddenOperationException;
import hu.hkristof.parkingapp.exceptions.UserAlreadyExistEception;
import hu.hkristof.parkingapp.exceptions.UserNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkHouse;
import hu.hkristof.parkingapp.models.Role;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.ParkHouseRepository;
import hu.hkristof.parkingapp.repositoris.UserRepository;
import hu.hkristof.parkingapp.responsetypes.UserDataResponse;
import hu.hkristof.parkingapp.responsetypes.UsersDataResponse;

@Service
public class UserService {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	@Autowired
	TimeLogService timeLogService;
	
	@Autowired
	ReservationService reservationService;
	
	@Autowired
	ParkHouseRepository parkHouseRepository;
	
	@Autowired
	ParkingLotService parkingLotService;
	
	@Autowired
	AuthenticatedUser authenticatedUser;
	
	/**
	 * Összes felhasználó lekérdezése.
	 * @return UsersDataResponse  
	 */
	public UsersDataResponse getAllUsers() {
		UsersDataResponse response = new UsersDataResponse();
	     List<User> users = (List<User>) userRepository.findAllByOrderByFirstName();
	     //Bejelentkezett felhasználó előrehozása.
	     for(int i = 0; i<users.size(); i++) {
	    	 if(users.get(i).getId()==authenticatedUser.getUser().getId()) {
	    		 users.set(i, users.get(0));
	    		 users.set(0, authenticatedUser.getUser());
	    		 break;
	    	 }
	     }
	     List<UserDataResponse> usersData = new ArrayList<>();
	     for(User user : users) {
	    	 UserDataResponse userData = getUser(user.getId());
	    	 usersData.add(userData);
	     }
	     response.setUsersData(usersData);
	     return response;
	}
	
	/**
	 * Egy felhasználó lekérdezése
	 * @param id Felhasználó azonosítója.
	 * @return UserDataResponse
	 */
	public UserDataResponse getUser(Long id) {
		UserDataResponse response = new UserDataResponse();
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+user.getFirstName()+" adatai lekérdezve!");
		response.setUser(user);
		response.setUserCars(user.getOwnedCars());
		response.setUserReservations(user.getReservations());
	    return response;
	}
	
	/**
	 * Felhasználó regisztrálása. Ha már létezik az emailcím, hiba választ adunk.
	 * Ha az első felhasználó regisztrált akkor a ROLE_FIRST_USER jogosultságot kapja.
	 * @param newUser Kérésből jövő új felhasználó objektum.
	 * @return Az új felhasználó
	 */
	public User signUp(@RequestBody User newUser) {
		Optional<User> optUser = userRepository.findByEmail(newUser.getEmail());
		
		if(optUser.isPresent()) {
			throw new UserAlreadyExistEception(newUser.getEmail());
		}
		newUser.setOwnedCars(new ArrayList<Car>());
		//Jelszót enkódolva tároljuk.
		newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
		List<User> users = (List<User>) userRepository.findAll();
		if(users.size()<1) {
			newUser.setRole(Role.ROLE_FIRST_USER);
		}else {
			newUser.setRole(Role.ROLE_USER);
		}
		
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+newUser.getFirstName()+" "+newUser.getLastName() +" beregisztrált "+newUser.getEmail()+" email címmel.");
		timeLogService.saveSignUpLog(newUser);
		return userRepository.save(newUser);
	}
	
	/**
	 * Bejelentkezés. Ha esetleg átjutott volna az autentikáción egy nem létező felasználó, akkor hibát dobunk.
	 * @return A bejelentkezett felhasználó adatai.
	 */
	public UserDataResponse login() {
		UserDataResponse response = new UserDataResponse();
		String email = authenticatedUser.getUser().getEmail();
		User loggedInUser = userRepository.findByEmail(email)
				.orElseThrow(()->new UserNotFoundException(email+" emaillel nincs felhasználó regisztrálva."));
		response.setUser(loggedInUser);
		response.setUserCars(loggedInUser.getOwnedCars());
		response.setUserReservations(loggedInUser.getReservations());
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+loggedInUser.getFirstName()+" "+loggedInUser.getLastName()+ " bejelentkezett!");
	    return response;
	}
	
	/**
	 * Adminisztációs jog adása.
	 * @param id Felhasználó azonosítója.
	 * @return Az újonnan admin felhasználó.
	 */
	public User grantAdmin(Long id){
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		if(user.getRole().equals(Role.ROLE_FIRST_USER)) {
			throw new ForbiddenOperationException("ROLE_NOT_FIRST_USER");
		}
		user.setRole(Role.ROLE_ADMIN);
		userRepository.save(user);
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+user.getFirstName()+" adminisztrátor lett!");
		return user;
	}
	
	/**
	 * Adminisztrációs jog elvétele. ROLE_FIRST_USER-t nem lehet módosítani.
	 * @param id Felhasználó azonosítója.
	 * @return A módosított felhasználó.
	 */
	public User depriveAdmin(Long id){
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		if(user.getRole().equals(Role.ROLE_FIRST_USER)) {
			throw new ForbiddenOperationException("FIRST_USER_CANT_BE_DEPRIVED");
		}
		user.setRole(Role.ROLE_USER);
		userRepository.save(user);
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+user.getFirstName()+" elvesztette adminisztrátori jogkörét!");
		return user;
	}
	
	/**
	 * ROLE_FIRST_USER titulus átruházása.
	 * @param id Felhasználó azonosítója.
	 * @return
	 */
	public User passFirstUser(Long id){
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		user.setRole(Role.ROLE_FIRST_USER);
		authenticatedUser.getUser().setRole(Role.ROLE_ADMIN);
		userRepository.save(user);
		userRepository.save(authenticatedUser.getUser());
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+authenticatedUser.getUser().getFirstName()+" átadta "+user.getFirstName()+"nak az első felhasználó titulusát.");
		return user;
	}
	
	/**
	 * Jelszó változtatása.
	 * @param id A felhasználó azonosítója.
	 * @param newPassword Új jelszó
	 * @return Szöveges üzenet a változtatás sikerességéről.
	 */
	public String changePassword(Long id, String newPassword){
		//Csak a saját jelszavat lehet módosítani.
		if(authenticatedUser.getUser().getId()==id) {
			authenticatedUser.getUser().setPassword(passwordEncoder.encode(newPassword));
			userRepository.save(authenticatedUser.getUser());
			System.out.println(new Timestamp(System.currentTimeMillis()).toString()+": jelszó változtatás!");
			return "PASSWORD CHANGE SUCCESS";
		}else {
			throw new ForbiddenOperationException("NOT_SELF_PASSWORD");
		}
		
	}
	
	/**
	 * Legközelebbi parkolóház meghatározása.
	 * @param userLong Felhasználó hosszúsági foka
	 * @param userLang Felhasználó szélességi foka.
	 * @return A legközelebb lévő parkolóház.
	 */
	public ParkHouse getClosestParkHouse(double userLong, double userLang) {
		List<ParkHouse> parkHouses = parkHouseRepository.findAll();
		ParkHouse closestPh = new ParkHouse();
		double minDistance=-1;
		for(ParkHouse ph : parkHouses) {
			double currentDistance = distance(userLong, userLang, ph.getLongitude(), ph.getLatitude());
			if(minDistance==-1 || currentDistance<minDistance) {
				minDistance = currentDistance;
				closestPh = ph;
			}
		}
		System.out.println(minDistance);
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+": Legközelebbi parkolóház lekérdezve!");
		
		return closestPh;
	}
	
	/**
	 * Felhasználó törlése. Ha volt parkolt autója akkor azokkal előbb kiáll, ha volt foglalása azok törlődnek.
	 * @param id A felhasználó azonosítója.
	 * @return
	 */
	public Long deleteUser(Long id) {
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		//Első felhasználót nem lehet törölni.
		if(user.getRole().equals(Role.ROLE_FIRST_USER)) {
			throw new ForbiddenOperationException("FIRST_USER_NOT_DELETABLE");
		}
		if(user.getOwnedCars().size()>0) {
			for(Car car : user.getOwnedCars()) {
				if(car.getOccupiedParkingLot()!=null) {
					parkingLotService.parkOut(car.getOccupiedParkingLot().getId());
				}
			}
		}
		int resSize = user.getReservations().size();
		if(user.getReservations()!=null) {
			for(int i = 0; i< resSize;i++) {
				reservationService.deleteReservation(user.getReservations().get(0));
			}
		}
		System.out.println(new Timestamp(System.currentTimeMillis()).toString()+
				": "+
				user.getEmail()+" elmailel rendelkező felhasználó törlésre került.");
		userRepository.delete(user);
		return user.getId();
	}
	
	//Két kkordináta kozotti távolság számítása.
	private double distance(double longitude1, double latitude1, double longitude2, double latitude2) {
		return Math.hypot((longitude2-longitude1),(latitude2-latitude1));
	}
}
