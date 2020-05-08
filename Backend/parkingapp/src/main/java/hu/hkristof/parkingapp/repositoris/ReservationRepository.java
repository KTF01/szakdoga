package hu.hkristof.parkingapp.repositoris;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hu.hkristof.parkingapp.models.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	
	@Query(value = "SELECT * FROM parking_database.reservations where end_time<:now", nativeQuery = true)
	List<Reservation> findAllExpired(@Param("now") String now);
}
