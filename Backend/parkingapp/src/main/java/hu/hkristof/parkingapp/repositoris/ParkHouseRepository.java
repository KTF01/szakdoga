package hu.hkristof.parkingapp.repositoris;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.hkristof.parkingapp.models.ParkHouse;

@Repository
public interface ParkHouseRepository extends JpaRepository<ParkHouse, Long>{

}
