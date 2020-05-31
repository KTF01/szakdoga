package hu.hkristof.parkingapp.unit;

import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.invocation.InvocationOnMock;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.exceptions.ForbiddenOperationException;
import hu.hkristof.parkingapp.exceptions.UserAlreadyExistEception;
import hu.hkristof.parkingapp.exceptions.UserNotFoundException;
import hu.hkristof.parkingapp.models.Role;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.ParkHouseRepository;
import hu.hkristof.parkingapp.repositoris.UserRepository;
import hu.hkristof.parkingapp.services.ParkingLotService;
import hu.hkristof.parkingapp.services.ReservationService;
import hu.hkristof.parkingapp.services.TimeLogService;
import hu.hkristof.parkingapp.services.UserService;

@RunWith(SpringRunner.class)
public class TestUserService {
	@Mock
	UserRepository userRepository;
	
	@Mock
	TimeLogService timeLogService;
	
	@Mock
	BCryptPasswordEncoder passwordEncoder;
	
	@Mock
	ReservationService reservationService;
	
	@Mock
	ParkHouseRepository parkHouseRepository;
	
	@Mock
	ParkingLotService parkingLotService;
	
	@Mock
	AuthenticatedUser authenticatedUser;
	
	@InjectMocks
	UserService userService;
	
	ArrayList<User> allUsers = new ArrayList<>();
	
	User testAuthUser = new User();
	
	@Before
	public void init() {
		for(int i = 0; i<4; i++) {
			User user = new User();
			user.setId((long)i);
			user.setFirstName("Gipsz"+i);
			user.setLastName("Jakab");
			user.setEmail("gipsz"+i+"@gmail.com");
			user.setRole(Role.ROLE_USER);
			allUsers.add(user);
		}
		testAuthUser = allUsers.get(2);
		allUsers.get(0).setRole(Role.ROLE_FIRST_USER);
		Mockito.when(userRepository.findAllByOrderByFirstName()).thenReturn(allUsers);
		Mockito.when(authenticatedUser.getUser()).thenReturn(testAuthUser);
		Mockito.when(userRepository.findByEmail(Mockito.anyString())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getEmail().equals(invocation.getArgument(0))) {
					return Optional.of(u);
				}
			}
			return Optional.empty();
			
		});
	}
	
	@Test
	public void testAllUsers() {
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getId()==invocation.getArgument(0)) {
					return Optional.of(u);
				}
			}
			throw new UserNotFoundException(invocation.getArgument(0).toString());
		});
		assertTrue(userService.getAllUsers().getUsersData().size()==4);
	}
	
	@Test(expected = UserNotFoundException.class)
	public void testAllUsersNoAuthenticatedUser() {
		User u = new User();
		u.setId(43L);
		Mockito.when(authenticatedUser.getUser()).thenReturn(u);
		userService.getAllUsers().getUsersData().size();
	}
	
	@Test
	public void testGetUserExist() {
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getId()==invocation.getArgument(0)) {
					return Optional.of(u);
				}
			}
			throw new UserNotFoundException(invocation.getArgument(0).toString());
		});
		assertTrue(userService.getUser(1L).getUser().getId()==1L);
	}
	
	@Test(expected = UserNotFoundException.class)
	public void testGetUserNotExist() {
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getId()==invocation.getArgument(0)) {
					return Optional.of(u);
				}
			}
			throw new UserNotFoundException(invocation.getArgument(0).toString());
		});
		userService.getUser(6L).getUser().getId();
	}
	
	@Test
	public void testSignUp() {
		User newTestUser = new User();
		newTestUser.setId(4L);
		newTestUser.setEmail("valami@valami.com");
		newTestUser.setPassword("password");
		allUsers.add(userService.signUp(newTestUser));
		assertTrue(allUsers.size()==5);
	}
	
	@Test(expected = UserAlreadyExistEception.class)
	public void testSignUpEmailExist() {
		User newTestUser = new User();
		newTestUser.setId(3L);
		newTestUser.setEmail("gipsz0@gmail.com");
		newTestUser.setPassword("password");
		allUsers.add(userService.signUp(newTestUser));
	}
	
	@Test
	public void testLogIn() {
		assertTrue(userService.login().getUser().getEmail().equals("gipsz2@gmail.com"));
	}
	
	@Test
	public void testGrantAdmin() {
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getId()==invocation.getArgument(0)) {
					return Optional.of(u);
				}
			}
			throw new UserNotFoundException(invocation.getArgument(0).toString());
		});
		assertTrue(userService.grantAdmin(1L).getRole().equals(Role.ROLE_ADMIN));
	}
	
	@Test
	public void testDepriveAdmin() {
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getId()==invocation.getArgument(0)) {
					return Optional.of(u);
				}
			}
			throw new UserNotFoundException(invocation.getArgument(0).toString());
		});
		allUsers.get(0).setRole(Role.ROLE_ADMIN);
		assertTrue(userService.depriveAdmin(1L).getRole().equals(Role.ROLE_USER));
	}
	
	@Test(expected = ForbiddenOperationException.class)
	public void testDepriveAdminFirstUser() {
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getId()==invocation.getArgument(0)) {
					return Optional.of(u);
				}
			}
			throw new UserNotFoundException(invocation.getArgument(0).toString());
		});
		assertTrue(!userService.depriveAdmin(0L).getRole().equals(Role.ROLE_USER));
	}
	

	@Test
	public void testPassFirstUser() {
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getId()==invocation.getArgument(0)) {
					return Optional.of(u);
				}
			}
			throw new UserNotFoundException(invocation.getArgument(0).toString());
		});
		assertTrue(userService.passFirstUser(1L).getRole().equals(Role.ROLE_FIRST_USER));
	}
	
	@Test(expected = UserNotFoundException.class)
	public void testPassFirstUserError() {
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getId()==invocation.getArgument(0)) {
					return Optional.of(u);
				}
			}
			throw new UserNotFoundException(invocation.getArgument(0).toString());
		});
		assertTrue(userService.passFirstUser(8L).getRole().equals(Role.ROLE_FIRST_USER));
	}
	
	@Test
	public void testChangePassword() {
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getId()==invocation.getArgument(0)) {
					return Optional.of(u);
				}
			}
			throw new UserNotFoundException(invocation.getArgument(0).toString());
		});
		assertTrue(userService.changePassword(2L, "ujPassword").equals("PASSWORD CHANGE SUCCESS"));
	}
	
	@Test(expected = ForbiddenOperationException.class)
	public void testChangePasswordNotSelf() {
		Mockito.when(userRepository.findById(Mockito.anyLong())).thenAnswer((InvocationOnMock invocation)->{
			for(User u : allUsers) {
				if(u.getId()==invocation.getArgument(0)) {
					return Optional.of(u);
				}
			}
			throw new UserNotFoundException(invocation.getArgument(0).toString());
		});
		assertTrue(userService.changePassword(1L, "ujPassword").equals("PASSWORD CHANGE SUCCESS"));
	}
	
}
