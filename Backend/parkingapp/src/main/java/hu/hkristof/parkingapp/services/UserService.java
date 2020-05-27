package hu.hkristof.parkingapp.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.Role;
import hu.hkristof.parkingapp.exceptions.ForbiddenOperationException;
import hu.hkristof.parkingapp.exceptions.UserAlreadyExistEception;
import hu.hkristof.parkingapp.exceptions.UserNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.ParkHouse;
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
	ParkHouseRepository parkHouseRepository;
	
	@Autowired
	ParkingLotService parkingLotService;
	
	@Autowired
	AuthenticatedUser authenticatedUser;
	
	public UsersDataResponse getAllUsers() {
		UsersDataResponse response = new UsersDataResponse();
	     List<User> users = (List<User>) userRepository.findAllByOrderByFirstName();
	     //Bring authenticated User to the first place.
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
	
	public UserDataResponse getUser(Long id) {
		UserDataResponse response = new UserDataResponse();
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		System.out.println(user.getFirstName()+" adatai lekérdezve!");
		response.setUser(user);
		response.setUserCars(user.getOwnedCars());
		response.setUserReservations(user.getReservations());
	    return response;
	}
	
	public User signUp(@RequestBody User newUser) {
		Optional<User> optUser = userRepository.findByEmail(newUser.getEmail());
		
		if(optUser.isPresent()) {
			throw new UserAlreadyExistEception(newUser.getEmail());
		}
		newUser.setOwnedCars(new ArrayList<Car>());
		newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
		List<User> users = (List<User>) userRepository.findAll();
		if(users.size()<1) {
			newUser.setRole(Role.ROLE_FIRST_USER);
		}else {
			newUser.setRole(Role.ROLE_USER);
		}
		
		System.out.println(newUser.getFirstName()+" "+newUser.getLastName() +" beregisztrált "+newUser.getEmail()+" email címmel.");
		timeLogService.saveSignUpLog(newUser);
		return userRepository.save(newUser);
	}
	
	
	public UserDataResponse login() {
		UserDataResponse response = new UserDataResponse();
		String email = authenticatedUser.getUser().getEmail();
		User loggedInUser = userRepository.findByEmail(email)
				.orElseThrow(()->new UsernameNotFoundException(email+" emaillel nincs felhasználó regisztrálva."));
		response.setUser(loggedInUser);
		response.setUserCars(loggedInUser.getOwnedCars());
		response.setUserReservations(loggedInUser.getReservations());
		System.out.println(loggedInUser.getFirstName()+" "+loggedInUser.getLastName()+ " bejelentkezett!");
	    return response;
	}
	
	
	public User grantAdmin(Long id){
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		if(user.getRole().equals(Role.ROLE_FIRST_USER)) {
			throw new ForbiddenOperationException("ROLE_NOT_FIRST_USER");
		}
		user.setRole(Role.ROLE_ADMIN);
		userRepository.save(user);
		System.out.println(user.getFirstName()+" admin lett!");
		return user;
	}
	
	public User depriveAdmin(Long id){
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		if(user.getRole().equals(Role.ROLE_FIRST_USER)) {
			return null;
		}
		user.setRole(Role.ROLE_USER);
		userRepository.save(user);
		System.out.println(user.getFirstName()+" elvesztette adminságát!");
		return user;
	}
	
	public User passFirstUser(Long id){
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		user.setRole(Role.ROLE_FIRST_USER);
		authenticatedUser.getUser().setRole(Role.ROLE_ADMIN);
		userRepository.save(user);
		userRepository.save(authenticatedUser.getUser());
		System.out.println(authenticatedUser.getUser().getFirstName()+" átadta "+user.getFirstName()+"nak a firstUserséget.");
		return user;
	}
	
	public String changePassword(Long id, String newPassword){
		if(authenticatedUser.getUser().getId()==id) {
			authenticatedUser.getUser().setPassword(passwordEncoder.encode(newPassword));
			userRepository.save(authenticatedUser.getUser());
			return "PASSWORD CHANGE SUCCESS";
		}else {
			return null;
		}
		
	}
	
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
		
		return closestPh;
	}
	
	public Long deleteUser(Long id) {
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		if(user.getOwnedCars().size()>0) {
			for(Car car : user.getOwnedCars()) {
				if(car.getOccupiedParkingLot()!=null) {
					parkingLotService.parkOut(car.getOccupiedParkingLot().getId());
				}
			}
		}
		System.out.println(user.getEmail()+" elmailel rendelkező felhasználó törlésre került.");
		userRepository.delete(user);
		return user.getId();
	}
	
	private double distance(double longitude1, double latitude1, double longitude2, double latitude2) {
		return Math.hypot((longitude2-longitude1),(latitude2-latitude1));
	}
}
