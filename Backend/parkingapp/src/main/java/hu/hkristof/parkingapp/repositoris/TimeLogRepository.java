package hu.hkristof.parkingapp.repositoris;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import hu.hkristof.parkingapp.models.TimeLog;

public interface TimeLogRepository extends JpaRepository<TimeLog, Long>{

	List<TimeLog> findAllByOrderByTimeDescIdDesc();
	
	@Query(value = "SELECT * FROM parking_database.time_logs where"
					+" user_name like %:userName% and action like %:action% "
					+ "and time between :startTime and :endTime ORDER BY time,id DESC",nativeQuery = true)
	List<TimeLog> findByFilter(@Param("userName") String userName, @Param("action") String action,
			@Param("startTime") String startTime, @Param("endTime") String endTime);
}
