package hu.hkristof.parkingapp;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import hu.hkristof.parkingapp.models.User;

@Component
@RequestScope
public class AuthenticatedUser {
    private User user;

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
    
    
}
