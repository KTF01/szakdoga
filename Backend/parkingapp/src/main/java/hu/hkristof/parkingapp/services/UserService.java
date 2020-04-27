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
import hu.hkristof.parkingapp.exceptions.UserAlreadyExistEception;
import hu.hkristof.parkingapp.exceptions.UserNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.User;
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
		System.out.println(loggedInUser.getFirstName()+" "+loggedInUser.getLastName()+ " bejelentkezett!");
	    return response;
	}
	
	
	public User grantAdmin(Long id){
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		if(user.getRole().equals(Role.ROLE_FIRST_USER)) {
			return null;
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
}