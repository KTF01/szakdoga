package hu.hkristof.parkingapp.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.Role;
import hu.hkristof.parkingapp.exceptions.UserAlreadyExistEception;
import hu.hkristof.parkingapp.exceptions.UserNotFoundException;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.UserRepository;
import hu.hkristof.parkingapp.responsetypes.UserDataResponse;
import hu.hkristof.parkingapp.responsetypes.UsersDataResponse;
import hu.hkristof.parkingapp.services.TimeLogService;

@CrossOrigin
@RestController
@RequestMapping
public class UserController {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	@Autowired
	TimeLogService timeLogService;
	
	@Autowired
	AuthenticatedUser authenticatedUser;
		
	@GetMapping("auth/users/all")
	public ResponseEntity<UsersDataResponse> getAllUsers() {
		UsersDataResponse response = new UsersDataResponse();
	     List<User> users = (List<User>) userRepository.findAll();
	     List<UserDataResponse> usersData = new ArrayList<>();
	     for(User user : users) {
	    	 UserDataResponse userData = getUser(user.getId()).getBody();
	    	 usersData.add(userData);
	     }
	     response.setUsersData(usersData);
	     return ResponseEntity.ok(response);
	}
	
	@GetMapping("auth/users/{id}")
	public ResponseEntity<UserDataResponse> getUser(@PathVariable Long id) {
		UserDataResponse response = new UserDataResponse();
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		System.out.println(user.getFirstName()+" adatai lekérdezve!");
		
		response.setUser(user);
		response.setUserCars(user.getOwnedCars());
		
	    return ResponseEntity.ok(response);
	}

	@PostMapping("/users/signUp")
	public ResponseEntity<User> signUp(@RequestBody User newUser) {
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
		return ResponseEntity.ok( userRepository.save(newUser));
	}
	
	@PostMapping("/auth/users/login")
	public ResponseEntity<UserDataResponse> login(@RequestBody String email) {
		UserDataResponse response = new UserDataResponse();
		
		User loggedInUser = userRepository.findByEmail(email)
				.orElseThrow(()->new UsernameNotFoundException(email+" emaillel nincs felhasználó regisztrálva."));
		response.setUser(loggedInUser);
		response.setUserCars(loggedInUser.getOwnedCars());
		System.out.println(loggedInUser.getFirstName()+" "+loggedInUser.getLastName()+ " bejelentkezett!");
	    return ResponseEntity.ok(response);
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@PutMapping("auth/users/grantAdmin/{id}")
	public ResponseEntity<User> grantAdmin(@PathVariable Long id){
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		if(user.getRole().equals(Role.ROLE_FIRST_USER)) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
		user.setRole(Role.ROLE_ADMIN);
		userRepository.save(user);
		System.out.println(user.getFirstName()+" admin lett!");
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@PutMapping("auth/users/depriveAdmin/{id}")
	public ResponseEntity<User> depriveAdmin(@PathVariable Long id){
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		if(user.getRole().equals(Role.ROLE_FIRST_USER)) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
		user.setRole(Role.ROLE_USER);
		userRepository.save(user);
		System.out.println(user.getFirstName()+" elvesztette adminságát!");
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}
	
	@Secured({"ROLE_FIRST_USER"})
	@PutMapping("auth/users/passFirstUser/{id}")
	public ResponseEntity<User> passFirstUser(@PathVariable Long id){
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		user.setRole(Role.ROLE_FIRST_USER);
		authenticatedUser.getUser().setRole(Role.ROLE_ADMIN);
		userRepository.save(user);
		userRepository.save(authenticatedUser.getUser());
		System.out.println(authenticatedUser.getUser().getFirstName()+" átadta "+user.getFirstName()+"nak a firstUserséget.");
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}
	
	@PutMapping("auth/users/changePassword/{id}")
	public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody String newPassword){
		if(authenticatedUser.getUser().getId()==id) {
			authenticatedUser.getUser().setPassword(passwordEncoder.encode(newPassword));
			userRepository.save(authenticatedUser.getUser());
			return new ResponseEntity<>("PASSWORD CHANGE SUCCESS", HttpStatus.OK);
		}else {
			return new ResponseEntity<>("NOT ALLOWED OPERATION!", HttpStatus.FORBIDDEN);
		}
		
	}
}
