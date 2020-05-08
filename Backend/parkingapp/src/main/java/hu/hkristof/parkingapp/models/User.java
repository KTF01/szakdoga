package hu.hkristof.parkingapp.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import hu.hkristof.parkingapp.Role;

@Entity
@Table(name = "users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank
	private String firstName;
	
	@NotBlank
	private String lastName;
	
	@NotBlank
	@JsonProperty(access = Access.WRITE_ONLY)
	private String password;
	
	@NotNull
	@Enumerated(EnumType.STRING)
	private Role role;
	
	@NotNull
	@OneToMany(mappedBy = "user")
	private List<Reservation> reservations;
	
	@NotBlank
	@Email
	@Column(unique = true)
	private String email;

	@JsonIdentityReference(alwaysAsId = true)
	@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
	private List<Car> ownedCars;
	
	public User(){
		this.ownedCars = new ArrayList<>();
		this.reservations = new ArrayList<>();
	}
	
	public void addCar(Car car) {
		car.setOwner(this);
		this.ownedCars.add(car);
	}
	
	public void removeCar(Car car) {
		car.setOwner(null);
		this.ownedCars.remove(car);
	}
	
	public void addReservation(Reservation reservation) {
		this.reservations.add(reservation);
		reservation.setUser(this);
	}
	
	public void removeReservation(Reservation reservation) {
		reservation.setUser(null);
		this.reservations.remove(reservation);
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	public List<Car> getOwnedCars() {
		return ownedCars;
	}

	public void setOwnedCars(List<Car> ownedCars) {
		this.ownedCars = ownedCars;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}
	

}
