package hu.hkristof.parkingapp.repositoris;

import org.springframework.data.jpa.repository.JpaRepository;

import hu.hkristof.parkingapp.models.Sector;

public interface SectionRepository extends JpaRepository<Sector, Long> {

}
