package hu.hkristof.parkingapp.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.exceptions.UserAlreadyExistEception;
import hu.hkristof.parkingapp.models.Car;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.UserRepository;

@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	UserRepository userRepository;
	
	@GetMapping("/all")
	public List<User> getAllNotes() {
	    return (List<User>) userRepository.findAll();
	}
	
	
	@PostMapping("/register")
	public User register(@RequestBody User newUser) {
		Optional<User> optUser = userRepository.findByUsername(newUser.getUsername());
		
		if(optUser.isPresent()) {
			throw new UserAlreadyExistEception(newUser.getUsername());
		}
		newUser.setOwnedCars(new ArrayList<Car>());
		return userRepository.save(newUser);
	}
}
