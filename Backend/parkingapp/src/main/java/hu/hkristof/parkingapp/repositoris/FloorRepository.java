package hu.hkristof.parkingapp.repositoris;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.hkristof.parkingapp.models.Floor;

@Repository
public interface FloorRepository extends JpaRepository<Floor, Long>{

}
