package hu.hkristof.parkingapp.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

@CrossOrigin
@RestController
@RequestMapping
public class UserController {
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	@Autowired 
	private AuthenticatedUser authenticatedUser;
		
	@GetMapping("auth/users/all")
	public List<User> getAllNotes() {
	    return (List<User>) userRepository.findAll();
	}
	
	@GetMapping("auth/users/{id}")
	public User getAllNotes(@PathVariable Long id) {
		User user = userRepository.findById(id).orElseThrow(()->new UserNotFoundException(id));
		System.out.println(user.getFirstName()+" adatai lekérdezve!");
		
	    return user;
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

		return ResponseEntity.ok( userRepository.save(newUser));
	}
	
	@PostMapping("/auth/users/login")
	public ResponseEntity<User> login(@RequestBody String email) {
		User loggedInUser = userRepository.findByEmail(email)
				.orElseThrow(()->new UsernameNotFoundException(email+" emaillel nincs felhasználó regisztrálva."));
		System.out.println(loggedInUser.getFirstName()+" "+loggedInUser.getLastName()+ " bejelentkezett!");
	    return ResponseEntity.ok(loggedInUser);
	} 
	
	public User getAuthenticatedUser(Authentication authentication) {
	    return authenticatedUser.getUser();
	}
}
