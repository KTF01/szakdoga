package hu.hkristof.parkingapp.repositoris;

import org.springframework.data.jpa.repository.JpaRepository;

import hu.hkristof.parkingapp.models.TimeLog;

public interface TimeLogRepository extends JpaRepository<TimeLog, Long>{

}
