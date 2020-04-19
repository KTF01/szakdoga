package hu.hkristof.parkingapp.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	public ResponseEntity<User> register(@RequestBody User newUser) {
		Optional<User> optUser = userRepository.findByEmail(newUser.getEmail());
		
		if(optUser.isPresent()) {
			throw new UserAlreadyExistEception(newUser.getEmail());
		}
		newUser.setOwnedCars(new ArrayList<Car>());
		newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
		newUser.setRole(Role.ROLE_USER);
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
	
}
