package hu.hkristof.parkingapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
	
	/**
	 * Összes felhasználó lekérdezése. az autóikkal és foglalásaikkal együtt.
	 * @return UsersDataResponse
	 */
	@GetMapping("auth/users/all")
	public ResponseEntity<UsersDataResponse> getAllUsers() {
	     return ResponseEntity.ok(userService.getAllUsers());
	}
	
	/**
	 * Egy felhasználó lekérdezése.
	 * @param id A felhasználó azonosítója.
	 * @return	UserDataResponse -> tartalmazza a felhasználó autóit és foglalásait.
	 */
	@GetMapping("auth/users/{id}")
	public ResponseEntity<UserDataResponse> getUser(@PathVariable Long id) {
	    return ResponseEntity.ok().header("content-type", "application/json; charset=utf-8").body(userService.getUser(id));
	}

	/**
	 * Regisztrációs végpont. Nincsen levédve autentikációval.
	 * @param newUser Az adabázisba lementeni kívánt felhasználó, ami jön a kérésből.
	 * @return Az új felhasználó.
	 */
	@PostMapping("/users/signUp")
	public ResponseEntity<User> signUp(@RequestBody User newUser) {
		return ResponseEntity.ok( userService.signUp(newUser));
	}
	
	/**
	 * Bejelentkező végpont.
	 * @return A bejelentkezett felhasználó adata.
	 */
	@PostMapping("/auth/users/login")
	public ResponseEntity<UserDataResponse> login() {
	    return ResponseEntity.ok().header("content-type", "application/json; charset=utf-8").body(userService.login());
	}
	
	/**
	 * ROLE_USER felhasználó jogosultságát átállítja ROLE_ADMIN-ra. Csak adminisztrátorok érhetik el.
	 * @param id A felhasználó azonosítója.
	 * @return A módosított felhasználó
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@PutMapping("auth/users/grantAdmin/{id}")
	public ResponseEntity<User> grantAdmin(@PathVariable Long id){
		User user = userService.grantAdmin(id);
		return new ResponseEntity<User>(user, HttpStatus.OK);	
	}
	
	/**
	 * ROLE_ADMIN jogosultságú felhasználót ROLE_USER-re állít.
	 * @param id A módosítandó felhasználó
	 * @return A módosított felhasználó.
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@PutMapping("auth/users/depriveAdmin/{id}")
	public ResponseEntity<User> depriveAdmin(@PathVariable Long id){
		User user = userService.depriveAdmin(id);
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}
	
	/**
	 * Első felhasználói titulus átruházása. Csak a ROLE_FIRST_USER joggal rendelkező felhasználó fér hozzá ehhez a végponthoz.
	 * @param id A felhasználó azonosítója akire átruházódik a ROLE_FIRST_USER szerep.
	 * @return A módosított felhasználó.
	 */
	@Secured({"ROLE_FIRST_USER"})
	@PutMapping("auth/users/passFirstUser/{id}")
	public ResponseEntity<User> passFirstUser(@PathVariable Long id){
		return new ResponseEntity<User>(userService.passFirstUser(id), HttpStatus.OK);
	}
	
	/**
	 * Jelszó megváltoztatásáért felelős végpont.
	 * @param id A felhasználó szonosítója.
	 * @param newPassword Az új jelszó.
	 * @return Szöveges üzenet a vátoztatás sikerességéről.
	 */
	@PutMapping("auth/users/changePassword/{id}")
	public ResponseEntity<String> changePassword(@PathVariable Long id, @RequestBody String newPassword){
		String message = userService.changePassword(id, newPassword);
		return new ResponseEntity<>(message, HttpStatus.OK);

		
	}
	
	/**
	 * A bejelentkezett felhasználóhoz legközelebb található parkolóház megtalálása.
	 * @param userLong A felhasználó  szélességi foka
	 * @param userLat A felhasználó hosszúsági foka.
	 * @return A legözelebbi parkolóház azonosítója.
	 */
	@GetMapping("auth/getClosestPh")
	public Long getCloesetParkHouse(@RequestParam("userLong") double userLong, @RequestParam("userLat") double userLat) {
		return userService.getClosestParkHouse(userLong, userLat).getId();
	}
	
	/**
	 * Felhasználó törlése.
	 * @param id A törölni kívánt felhasználó azonosítója.
	 * @return A törölt felhasználó azonosítója.
	 */
	@Secured({"ROLE_ADMIN", "ROLE_FIRST_USER"})
	@DeleteMapping("auth/deleteUser/{id}")
	public ResponseEntity<Long> deletUser(@PathVariable Long id){
		return new ResponseEntity<>( userService.deleteUser(id), HttpStatus.OK);
	}
	
}
