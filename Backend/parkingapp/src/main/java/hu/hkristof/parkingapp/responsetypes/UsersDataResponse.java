package hu.hkristof.parkingapp.responsetypes;

import java.util.List;

public class UsersDataResponse {
	
	List<UserDataResponse> usersData;

	public List<UserDataResponse> getUsersData() {
		return usersData;
	}

	public void setUsersData(List<UserDataResponse> usersData) {
		this.usersData = usersData;
	}
	
	public void addUserData(UserDataResponse userData) {
		this.usersData.add(userData);
	}
}
