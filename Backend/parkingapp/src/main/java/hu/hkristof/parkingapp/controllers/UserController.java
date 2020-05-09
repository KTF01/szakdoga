package hu.hkristof.parkingapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.responsetypes.UserDataResponse;
import hu.hkristof.parkingapp.responsetypes.UsersDataResponse;
import hu.hkristof.parkingapp.services.UserService;

@CrossOrigin
@RestController
@RequestMapping
public class UserController {
		
	@Autowired
	UserService userService;
	
	@GetMapping("auth/users/all")
	public ResponseEntity<UsersDataResponse> getAllUsers() {
	     return ResponseEntity.ok(userService.getAllUsers());
	}
	
	@GetMapping("auth/users/{id}")
	public ResponseEntity<UserDataResponse> getUser(@PathVariable Long id) {
	    return ResponseEntity.ok().header("content-type", "application/json; charset=utf-8").body(userService.getUser(id));
	}

	@PostMapping("/users/signUp")
	public ResponseEntity<User> signUp(@RequestBody User newUser) {
		return ResponseEntity.ok( userService.signUp(newUser));
	}
	
	@PostMapping("/auth/users/login")
	public ResponseEntity<UserDataResponse> login() {
	    return ResponseEntity.ok().header("content-type", "application/json; charset=utf-8").body(userService.login());
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@PutMapping("auth/users/grantAdmin/{id}")
	public ResponseEntity<User> grantAdmin(@PathVariable Long id){
		User user = userService.grantAdmin(id);
		if(user==null) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}else {
			return new ResponseEntity<User>(user, HttpStatus.OK);
		}
		
	}
	
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@PutMapping("auth/users/depriveAdmin/{id}")
	public ResponseEntity<User> depriveAdmin(@PathVariable Long id){
		User user = userService.depriveAdmin(id);
		if(user==null) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}else {
			return new ResponseEntity<User>(user, HttpStatus.OK);
		}
		
	}
	
	@Secured({"ROLE_FIRST_USER"})
	@PutMapping("auth/users/passFirstUser/{id}")
	public ResponseEntity<User> passFirstUser(@PathVariable Long id){
		return new ResponseEntity<User>(userService.passFirstUser(id), HttpStatus.OK);
	}
	
	@PutMapping("auth/users/changePassword/{id}")
	public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody String newPassword){
		String message = userService.changePassword(id, newPassword);
		if(message!=null) {
			return new ResponseEntity<>("PASSWORD CHANGE SUCCESS", HttpStatus.OK);
		}else {
			return new ResponseEntity<>("NOT ALLOWED OPERATION!", HttpStatus.FORBIDDEN);
		}
		
	}
	
	@GetMapping("auth/getClosestPh")
	public Long getCloesetParkHouse(@RequestParam("userLong") double userLong, @RequestParam("userLat") double userLat) {
		System.out.println("Legközelebbi parkolóház lekérdezve!");
		return userService.getClosestParkHouse(userLong, userLat).getId();
	}
	
}
