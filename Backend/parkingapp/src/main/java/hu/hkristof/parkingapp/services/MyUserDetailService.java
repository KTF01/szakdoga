package hu.hkristof.parkingapp.services;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import hu.hkristof.parkingapp.AuthenticatedUser;
import hu.hkristof.parkingapp.models.User;
import hu.hkristof.parkingapp.repositoris.UserRepository;

@Service
public class MyUserDetailService implements UserDetailsService{

	@Autowired
	private UserRepository userRepository;
	
	@Autowired 
	private AuthenticatedUser authenticatedUser;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Optional<User> oUser = userRepository.findByEmail(email);
		if (!oUser.isPresent()) {
            throw new UsernameNotFoundException(email);
        }
		User user = oUser.get();
		authenticatedUser.setUser(user);
		
		Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(user.getRole().toString()));

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), grantedAuthorities);

	}

}
